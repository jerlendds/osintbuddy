// @ts-nocheck
import { useCallback, useState, useRef, useMemo, useEffect } from 'react';
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Edge,
  XYPosition,
  Node,
  Background,
  Controls,
  BackgroundVariant,
  FitViewOptions,
  useStore,
  useOnSelectionChange,
} from 'reactflow';
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HotKeys } from 'react-hotkeys';
import { useLocation } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';

import BaseNode from './BaseNode';
import { nodesService } from '@/services';
import 'reactflow/dist/style.css';

const viewOptions: FitViewOptions = {
  padding: 50,
};

const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('@todo drag stop update position', node);

export default function ProjectGraph({
  graphRef,
  nodes,
  setNodes,
  onNodesChange,
  edges,
  setEdges,
  onEdgesChange,
  graphInstance,
  setGraphInstance,
  addEdge,
  sendJsonMessage,
  updateNode,
  setEditState,
  onPaneClick,
  onPaneCtxMenu,
  onSelectionCtxMenu,
  onMultiSelectionCtxMenu,
}: JSONObject) {
  const onConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, edges)), [setEdges]);

  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) => setEdges((els) => updateEdge(oldEdge, newConnection, els)),
    []
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    async (event) => {
      event.preventDefault();
      const label = event.dataTransfer.getData('application/reactflow');
      if (typeof label === 'undefined' || !label) return;

      const graphBounds = graphRef.current.getBoundingClientRect();
      const position = graphInstance.project({
        x: event.clientX - graphBounds.left,
        y: event.clientY - graphBounds.top,
      });
      nodesService
        .createNode({
          label,
          position,
        })
        .then((data) => {
          const id = data.id.toString();
          delete data.id;
          delete data.position;
          setNodes((nds) =>
            nds.concat({
              id,
              data,
              position,
              type: 'base',
            })
          );
        })
        .catch((error) => toast.error(`Error: ${error}`));
    },
    [graphInstance]
  );

  const nodeTypes = useMemo(
    () => ({
      base: (data) => (
        <BaseNode node={data} setEditState={setEditState} updateNode={updateNode} sendJsonMessage={sendJsonMessage} />
      ),
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
      onConnect={onConnect}
      onDragOver={onDragOver}
      onEdgeUpdate={onEdgeUpdate}
      onInit={setGraphInstance}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
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
