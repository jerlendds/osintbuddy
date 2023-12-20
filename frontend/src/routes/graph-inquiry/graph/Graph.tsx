import { useCallback, useState, useMemo, DragEventHandler, useEffect, MouseEvent } from 'react';
import ReactFlow, {
  Edge,
  Background,
  BackgroundVariant,
  FitViewOptions,
  NodeDragHandler,
  Connection,
  Node,
} from 'reactflow';
import BaseNode from '../_components/BaseNode';
import { addNodeUpdate, createEdge, disableEntityEdit, enableEntityEdit, onEdgesChange, selectEditState, setEditLabel, setEditState, updateEdgeEvent, updateNodeFlow } from '@src/features/graph/graphSlice';
import { useAppDispatch, useAppSelector } from '@src/app/hooks';
import { toast } from 'react-toastify';
import BaseMiniNode from '../_components/BaseMiniNode';
import { CreateGraphEntityApiResponse, useCreateGraphEntityMutation, useRefreshPluginsQuery } from '@src/app/api';
import { useParams } from 'react-router-dom';
import NewConnectionLine from './ConnectionLine';
import SimpleFloatingEdge from './SimpleFloatingEdge';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';

const viewOptions: FitViewOptions = {
  padding: 50,
};

// im lazy so im extending the generic JSONObject for now, feel free to fix...
interface ProjectGraphProps extends JSONObject {
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
  useRefreshPluginsQuery({ hid: hid as string })

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }, []);

  const [blankNode, setBlankNode] = useState<any>({ label: null, position: null });
  const [createGraphEntity, {
    isError: isCreateEntityError,
    isLoading: isLoadingCreateEntity }
  ] = useCreateGraphEntityMutation(blankNode)

  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    async (event) => {
      event.preventDefault();
      const label = event.dataTransfer && event.dataTransfer.getData('application/reactflow');
      if (typeof label === 'undefined' || !label) return;

      const graphBounds = graphRef.current.getBoundingClientRect();
      const position = graphInstance.project({
        x: event.clientX - graphBounds.left,
        y: event.clientY - graphBounds.top,
      });
      if (label && position && hid) {
        const createNode = { label, position }
        createGraphEntity({ createNode, hid })
          .then(({ data }: CreateGraphEntityApiResponse) => {
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
        <BaseNode
          ctx={data}
          dispatch={dispatch}
          sendJsonMessage={sendJsonMessage}
        />),
      view: (data: JSONObject) => (
        <BaseMiniNode
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
  const doubleClickThreshold = 325;
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

  return (
    <ReactFlow
      minZoom={0.2}
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
      fitViewOptions={viewOptions}
      nodeTypes={nodeTypes}
      panActivationKeyCode='Space'
      onNodeDragStop={onNodeDragStop}
      onPaneClick={onPaneClick}
      onPaneContextMenu={onPaneCtxMenu}
      onNodeContextMenu={onSelectionCtxMenu}
      onSelectionContextMenu={onMultiSelectionCtxMenu}
      connectionLineComponent={NewConnectionLine}
      elevateNodesOnSelect={true}
      fitView
    >
      <Background size={2} variant={BackgroundVariant.Dots} className='bg-transparent' color='#35426FAA' />
    </ReactFlow>
  );
}
