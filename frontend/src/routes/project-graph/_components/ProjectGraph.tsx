import { useCallback, useState, useMemo, DragEventHandler } from 'react';
import ReactFlow, {
  Edge,
  Background,
  Controls,
  BackgroundVariant,
  FitViewOptions,
  NodeDragHandler,
  Connection,
} from 'reactflow';
import BaseNode from './BaseNode';
import {
  fetchNodeBlueprint,
  onEdgeConnect,
  updateEdgeEvent,
  updateNodeFlow,
} from '@/features/graph/graphSlice';
import { useAppDispatch } from '@/app/hooks';
import { toast } from 'react-toastify';

const viewOptions: FitViewOptions = {
  padding: 50,
};

const onNodeDragStop: NodeDragHandler = (_, node) => console.log('@todo on drag stop, update position', node);

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
}: JSONObject) {
  const dispatch = useAppDispatch();

  const [isSavingNewNode, setSavingNewNode] = useState(false);
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => dispatch(updateEdgeEvent({ oldEdge, newConnection })),
    []
  );

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    async (event) => {
      event.preventDefault();
      setSavingNewNode(true);
      const label = event.dataTransfer && event.dataTransfer.getData('application/reactflow');
      if (typeof label === 'undefined' || !label) return;

      const graphBounds = graphRef.current.getBoundingClientRect();
      const position = graphInstance.project({
        x: event.clientX - graphBounds.left,
        y: event.clientY - graphBounds.top,
      });
      console.log('DROP POSITION?!', position)
      try {
        await dispatch(
          fetchNodeBlueprint({
            label,
            position,
          })
        ).unwrap();
      } catch (error: unknown) {
        if (error instanceof Error) toast.info(error.message);
      } finally {
        setSavingNewNode(false);
      }
    },
    [graphInstance]
  );

  const nodeTypes = useMemo(
    () => ({
      base: (data: JSONObject) => <BaseNode ctx={data} sendJsonMessage={sendJsonMessage} />,
    }),
    []
  );

  return (
    <ReactFlow
      minZoom={0.2}
      maxZoom={2.0}
      nodes={nodes}
      edges={edges}
      onDrop={onDrop}
      onConnect={(connection) => {
        dispatch(onEdgeConnect(connection));
      }}
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
      <Background variant={BackgroundVariant.Dots} className='bg-dark-[rgb(10 15 20)]' color='#1F3057' />
      <Controls />
    </ReactFlow>
  );
}
