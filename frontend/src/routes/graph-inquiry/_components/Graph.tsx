import { useCallback, useState, useMemo, DragEventHandler, useEffect, MouseEvent } from 'react';
import ReactFlow, {
  Edge,
  Background,
  BackgroundVariant,
  FitViewOptions,
  NodeDragHandler,
  Connection,
  Node,
  getViewportForBounds,
  MiniMap,
  ReactFlowInstance,
  getNodesBounds,
  getBoundsOfRects,
  getTransformForBounds,
} from 'reactflow';
import EditEntityNode from './EntityEditNode';
import { addNodeUpdate, createEdge, disableEntityEdit, enableEntityEdit, graph, onEdgesChange, selectEditState, setEditLabel, setEditState, updateEdgeEvent, updateNodeFlow } from '@src/features/graph/graphSlice';
import { useAppDispatch, useAppSelector, useEffectOnce } from '@src/app/hooks';
import { toast } from 'react-toastify';
import ViewEntityNode from './EntityViewNode';
import { CreateEntityOnDropApiResponse, useCreateEntityOnDropMutation, useRefreshEntityPluginsQuery } from '@src/app/api';
import { useParams } from 'react-router-dom';
import NewConnectionLine from './ConnectionLine';
import SimpleFloatingEdge from './SimpleFloatingEdge';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';

const viewOptions: FitViewOptions = {
  padding: 50,
};

// im lazy so im extending the generic JSONObject for now, feel free to fix...
interface ProjectGraphProps extends JSONObject {
  graphInstance?: ReactFlowInstance
}

export default function Graph({
  onSelectionCtxMenu,
  onMultiSelectionCtxMenu,
  onPaneCtxMenu,
  onPaneClick,
  graphRef,
  nodes,
  edges,
  graphInstance,
  setGraphInstance,
  sendJsonMessage,
  fitView,
  positionMode,
  editState
}: ProjectGraphProps) {
  const dispatch = useAppDispatch();
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => dispatch(updateEdgeEvent({ oldEdge, newConnection })),
    []
  );
  const { hid } = useParams()
  useRefreshEntityPluginsQuery({ hid: hid as string })

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }, []);

  const [blankNode, setBlankNode] = useState<any>({ label: null, position: null });
  const [createGraphEntity, {
    isError: isCreateEntityError,
    isLoading: isLoadingCreateEntity }
  ] = useCreateEntityOnDropMutation(blankNode)

  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    async (event) => {
      event.preventDefault();
      const label = event.dataTransfer && event.dataTransfer.getData('application/reactflow');
      if (typeof label === 'undefined' || !label) return;

      const graphBounds = graphRef.current.getBoundingClientRect();
      const position = graphInstance?.project({
        x: event.clientX - graphBounds.left,
        y: event.clientY - graphBounds.top,
      });
      if (label && position && hid) {
        const createNode = { label, position }
        createGraphEntity({ createNode, hid })
          .then(({ data }: CreateEntityOnDropApiResponse) => {
            dispatch(addNodeUpdate({ position, label, ...data, }))
            dispatch(setEditState({ editId: data.id, editLabel: 'createEntity' }))
          })
          .catch((error: any) => {
            console.error(error)
            toast.error(`We ran into a problem creating the ${label} entity. Please try again`)
          })
      }
    },
    [graphInstance]
  );

  const nodeTypes = useMemo(
    () => ({
      edit: (data: JSONObject) => (
        <EditEntityNode
          ctx={data}
          dispatch={dispatch}
          sendJsonMessage={sendJsonMessage}
        />
      ),
      view: (data: JSONObject) => (
        <ViewEntityNode
          ctx={data}
          dispatch={dispatch}
        />
      ),
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({
      float: SimpleFloatingEdge
    }),
    []
  );

  const doubleClickThreshold = 320;
  const [isDragging, setIsDragging] = useState(false)
  const [isDoubleClick, setIsDoubleClick] = useState(false)
  const [entityPosition, setEntityPosition] = useState<any>({ x: null, y: null })
  const [clickDelta, setClickDelta] = useState(0)

  const onNodeDragStop: NodeDragHandler = (_, node) => {
    if (positionMode === 'manual' && (entityPosition.x !== node.position.x || entityPosition.y !== node.position.y)) {
      sendJsonMessage({ action: 'update:node', node: { id: node.id, x: node.position.x, y: node.position.y } });
      setEntityPosition({ x: node.position.x, y: node.position.y })
    }
    if (editState !== 'dragEntity' && !isDoubleClick) {
      dispatch(setEditState({ editId: node.id, editLabel: "dragEntity" }))
    }
  };

  const handleGraphRead = (readType: string = 'read') => {
    const viewport: any = graphInstance?.getViewport()
    if (viewport) {
      sendJsonMessage({
        action: `${readType}:graph`,
        viewport
      })
    }
  }

  useEffect(() => {
    // TODO: implement loading/unloading nodes after drag
    // !isDragging && handleGraphRead()
  }, [isDragging])

  useEffect(() => {
    graphInstance?.setViewport({ x: 0, y: 0, zoom: 0.22 })
    handleGraphRead('initial_read');
  }, [graphInstance?.getViewport])

  return (
    <ReactFlow
      onlyRenderVisibleElements={true}
      nodeDragThreshold={20}
      minZoom={0.22}
      maxZoom={2.0}
      nodes={nodes}
      edges={edges}
      onDrop={onDrop}
      onConnect={(connection) => dispatch(createEdge(connection))}
      onEdgesChange={(changes) => dispatch(onEdgesChange(changes))}
      edgeTypes={edgeTypes}
      onDragOver={onDragOver}
      onEdgeUpdate={onEdgeUpdate}
      onInit={setGraphInstance}
      onNodesChange={(changes) => dispatch(updateNodeFlow(changes))}
      onNodeClick={(_, node) => {
        const newDelta = new Date().getTime()
        const isDouble = newDelta - clickDelta < doubleClickThreshold
        if (isDouble) {
          if (node.type === 'view') dispatch(enableEntityEdit(node.id))
          else dispatch(disableEntityEdit(node.id))
        }
        setClickDelta(newDelta)
        setIsDoubleClick(isDouble)
      }}
      onMoveStart={() => !isDragging && setIsDragging(true)}
      onMoveEnd={() => setIsDragging(false)}
      fitViewOptions={viewOptions}
      nodeTypes={nodeTypes}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      panActivationKeyCode='Space'
      onNodeDragStop={onNodeDragStop}
      onPaneClick={onPaneClick}
      onPaneContextMenu={onPaneCtxMenu}
      onNodeContextMenu={onSelectionCtxMenu}
      onSelectionContextMenu={onMultiSelectionCtxMenu}
      connectionLineComponent={NewConnectionLine}
      elevateNodesOnSelect={true}
    >
      <Background size={2.5} variant={BackgroundVariant.Dots} className='bg-transparent' color='#334155e6' />
    </ReactFlow>
  );
}
