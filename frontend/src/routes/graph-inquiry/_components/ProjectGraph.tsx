import { useCallback, useState, useMemo, DragEventHandler, useEffect } from 'react';
import ReactFlow, {
  Edge,
  Background,
  Controls,
  BackgroundVariant,
  FitViewOptions,
  NodeDragHandler,
  Connection,
  Panel,
} from 'reactflow';
import BaseNode from './BaseNode';
import { addNodeUpdate, createEdge, onEdgesChange, updateEdgeEvent, updateNodeFlow } from '@/features/graph/graphSlice';
import { useAppDispatch } from '@/app/hooks';
import { toast } from 'react-toastify';
import BaseMiniNode from './BaseMiniNode';
import { CreateGraphEntityApiResponse, CreateNode, useCreateEntityMutation, useCreateGraphEntityMutation, useGetEntityTransformsQuery, useRefreshPluginsQuery } from '@/app/api';
import { CreateGraphEntityApiArg } from '../../../app/api';
import { useParams } from 'react-router-dom';

const viewOptions: FitViewOptions = {
  padding: 50,
};

// im lazy so im extending the generic JSONObject for now, feel free to fix...
interface ProjectGraphProps extends JSONObject {
}

export default function ProjectGraph({
  graphRef,
  nodes,
  edges,
  graphInstance,
  setGraphInstance,
  addEdge,
  sendJsonMessage,
  onPaneClick,
  onPaneCtxMenu,
  onSelectionCtxMenu,
  onMultiSelectionCtxMenu,
  setIsEditingMini,
  isEditingMini,
  closeMiniRef,
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
          .then(({ data }: CreateGraphEntityApiResponse) => dispatch(addNodeUpdate({ position, label, ...data, })))
          .catch((error) => {
            console.error(error)
            toast.error(`We ran into a problem creating the ${label} entity. Please try again`)
          })
      }
    },
    [graphInstance]
  );



  const nodeTypes = useMemo(
    () => ({
      base: (data: JSONObject) => (
        <BaseNode
          dispatch={dispatch}
          ctx={data}
          closeRef={closeMiniRef}
          sendJsonMessage={sendJsonMessage}
        />),
      mini: (data: JSONObject) => (
        <BaseMiniNode
          dispatch={dispatch}
          isOpen={isEditingMini}
          setIsOpen={setIsEditingMini}
          closeRef={closeMiniRef}
          setIsEditing={setIsEditingMini}
          ctx={data}
          sendJsonMessage={sendJsonMessage}
        />
      ),
    }),
    []
  );

  const edgeTypes = useMemo(
    () => ({}),
    []
  );

  const onNodeDragStop: NodeDragHandler = (_, node) => {
    sendJsonMessage({ action: 'update:node', node: { id: node.id, x: node.position.x } });
    sendJsonMessage({ action: 'update:node', node: { id: node.id, y: node.position.y } });
  };

  return (
    <ReactFlow
      minZoom={0.05}
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
      fitView
      fitViewOptions={viewOptions}
      nodeTypes={nodeTypes}
      panActivationKeyCode='Space'
      onNodeDragStop={onNodeDragStop}
      onPaneClick={onPaneClick}
      onPaneContextMenu={onPaneCtxMenu}
      onNodeContextMenu={onSelectionCtxMenu}
      onSelectionContextMenu={onMultiSelectionCtxMenu}
    >

      <Background variant={BackgroundVariant.Dots} className='bg-transparent' color='#394778' />
      {/* <Controls /> */}
    </ReactFlow>
  );
}
