// @ts-nocheck
import { useCallback, useState, useRef, useMemo, useEffect, createRef } from 'react';
import ReactFlow, {
  useNodesState,
  ReactFlowProvider,
  useEdgesState,
  Edge,
  XYPosition,
  useStore,
  Node,
  Elements,
  Background,
  Controls,
  BackgroundVariant,
  isNode,
  FitViewOptions,
} from 'reactflow';
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HotKeys } from 'react-hotkeys';
import { useLocation } from 'react-router-dom';
import 'reactflow/dist/style.css';
import classNames from 'classnames';
import BreadcrumbHeader from './_components/BreadcrumbHeader';
import NodeOptions from './_components/NodeOptions';
import CommandPallet from '@/routes/osint/_components/CommandPallet';
import { GoogleNode, GoogleNodeContext } from './_nodes/GoogleNode';
import { CseNode, CseNodeContext } from './_nodes/CseNode';
import { DnsNode } from './_nodes/DnsNode';
import { DomainNode, DomainNodeContext } from './_nodes/DomainNode';
import { EmailNode, EmailNodeContext } from './_nodes/EmailNode';
import IpNodeContext, { IpNode } from './_nodes/IpNode';
import { ResultNode, ResultNodeContext } from './_nodes/ResultNode';
import { SubdomainNode } from './_nodes/SubdomainsNode';
import { WhoisNode } from './_nodes/WhoisNode';
import ContextMenu from './_components/ContextMenu';
import { GeoNode } from './_nodes/GeoNode';
import { TracerouteNode } from './_nodes/TracerouteNode';
import { UrlScanNode } from './_nodes/UrlScanNode';
import UrlNodeContext, { UrlNode } from './_nodes/UrlNode';
import { SmtpNode } from './_nodes/SmtpNode';
import { UsernameNode, UsernameNodeContext } from './_nodes/UsernameNode';
import { ProfileNode, ProfileNodeContext } from './_nodes/ProfileNode';
import dagre from 'dagre';

export var nodeId = 0;

export const getId = (): NodeId => {
  nodeId++;
  return `n_${nodeId}`;
};

const fitViewOptions: FitViewOptions = {
  padding: 50,
};

const getLayoutedElements = (nodes, edges, direction = 'LR') => {
  const dagreGraph = new dagre.graphlib.Graph().setGraph({});
  const isHorizontal = direction === 'LR';
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: node.width, height: node.height });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target, { label: '' });
  });
  console.log('dagreGraph', dagreGraph);
  dagre.layout(dagreGraph);

  nodes.forEach((node, idx) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = isHorizontal ? 'left' : 'top';
    node.sourcePosition = isHorizontal ? 'right' : 'bottom';

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x - node.width / 2,
      y: nodeWithPosition.y - node.height / 2,
    };
    console.log('dagre node', node);
    return node;
  });

  return { nodes, edges };
};
const DnDFlow = ({
  reactFlowWrapper,
  nodes,
  setNodes,
  onNodesChange,
  edges,
  setEdges,
  onEdgesChange,
  reactFlowInstance,
  setReactFlowInstance,
  deleteNode,
  addNode,
  addEdge,
}) => {
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
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }
      const position = reactFlowInstance.project({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: `${getId()}`,
        type,
        position,
        data: {},
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, nodeId]
  );

  const nodeTypes = useMemo(() => {
    return {
      url: (data) => <UrlNode flowData={data} />,
      dns: (data) => <DnsNode flowData={data} />,
      domain: (data) => <DomainNode flowData={data} />,
      email: (data) => <EmailNode flowData={data} />,
      subdomain: (data) => <SubdomainNode flowData={data} />,
      google: (data) => <GoogleNode flowData={data} />,
      cse: (data) => <CseNode flowData={data} />,
      smtp: (data) => <SmtpNode flowData={data} />,
      whois: (data) => <WhoisNode flowData={data} />,
      ip: (data) => <IpNode flowData={data} />,
      result: (data) => <ResultNode addNode={addNode} addEdge={addEdge} flowData={data} />,
      profile: (data) => <ProfileNode addNode={addNode} addEdge={addEdge} flowData={data} />,
      geo: (data) => <GeoNode flowData={data} />,
      urlscan: (data) => <UrlScanNode flowData={data} />,
      traceroute: (data) => <TracerouteNode flowData={data} />,
      username: (data) => <UsernameNode flowData={data} />,
    };
  }, []);

  //   const size = useStore((s) => {
  //   const node = s.nodeInternals.get('n_1');
  //   return {
  //     width: node?.width,
  //     height: node?.height,
  //   };
  // });
  // console.log('size', size);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* <ReactFlowProvider> */}
      <div style={{ width: '100%', height: '100%' }} ref={reactFlowWrapper}>
        <ReactFlow
          elements={[
            {
              id: '1',
              type: 'input',
              data: { label: 'input' },
              position: { x: 0, y: 0 },
            },
          ]}
          minZoom={0.2}
          maxZoom={2.0}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onEdgeUpdate={onEdgeUpdate}
          onDragOver={onDragOver}
          fitView
          fitViewOptions={fitViewOptions}
          nodeTypes={nodeTypes}
        >
          {/* <NodeDebug /> */}
          <Background variant={BackgroundVariant.Lines} color='#0F172A' />
          <Controls />
        </ReactFlow>
      </div>
      {/* </ReactFlowProvider> */}
    </div>
  );
};

const initialEdges = [];
const initialNodes = [];

const keyMap = {
  TOGGLE_PALETTE: ['shift+p'],
};

export interface AddNode {
  id: number;
  type: string;
  position: XYPosition;
  data: any;
}

export interface AddEdge {
  source: string;
  target: string;
  sourceHandle?: string | undefined;
  targetHandle?: string | undefined;
  type?: string | undefined;
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function OsintPage() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);
  console.log('nodes', nodes)
  console.log('edges', edges)
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodeId, setNodeId] = useState<number>(0);
  let setViewport,
    zoomIn,
    zoomOut = null;
  if (reactFlowInstance) {
    ({ setViewport, zoomIn, zoomOut } = reactFlowInstance);
  }

  function addNode(id, type, position, data: AddNode): Node<XYPosition> {
    let addPosition = null;
    if (reactFlowInstance) {
      addPosition = reactFlowInstance.project(position);
    } else {
      addPosition = position;
    }
    const newNode = {
      id,
      type,
      data,
      position: addPosition,
    };
    setNodes((nds) => nds.concat(newNode));
    return addPosition;
  }

  function addEdge(source, target, sourceHandle, targetHandle, type: AddEdge): void {
    const newEdge = {
      source,
      target,
      sourceHandle: sourceHandle || 'r1',
      targetHandle: targetHandle || 'l1',
      type: type || 'bezier',
    };
    setEdges((eds) => eds.concat(newEdge));
  }

  function deleteNode(nodeId: NodeId): void {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
  }
  // https://reactflow.dev/docs/examples/layout/dagre/
  const location = useLocation();
  const activeCase = location?.state?.activeCase;

  const [showNodeOptions, setShowNodeOptions] = useState<boolean>(false);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);

  const togglePalette = () => setShowCommandPalette(!showCommandPalette);
  const toggleShowNodeOptions = () => setShowNodeOptions(!showNodeOptions);

  const handlers = {
    TOGGLE_PALETTE: togglePalette,
  };

  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);
      console.log('onLayout', nodes, edges, layoutedNodes, layoutedNodes);

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );


  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <div className='h-screen flex flex-col w-full'>
        <BreadcrumbHeader onLayout={onLayout} activeProject={activeCase?.name || 'Unknown'} />
        <div className='flex h-full'>
          <DnDFlow
            addNode={addNode}
            deleteNode={deleteNode}
            addEdge={addEdge}
            reactFlowWrapper={reactFlowWrapper}
            nodes={nodes}
            setNodes={setNodes}
            onNodesChange={onNodesChange}
            edges={edges}
            setEdges={setEdges}
            onEdgesChange={onEdgesChange}
            reactFlowInstance={reactFlowInstance}
            setReactFlowInstance={setReactFlowInstance}
          />
        </div>
        <CommandPallet
          toggleShowOptions={toggleShowNodeOptions}
          isOpen={showCommandPalette}
          setOpen={setShowCommandPalette}
        />
      </div>
      <NodeOptions />
      <ContextMenu
        menu={({ node }) => {
          let parentId = null;
          let nodeData = null;
          let nodeType = null;
          let titleNodeType = null;

          if (node) {
            nodeData = node?.querySelectorAll('[data-type]');
            parentId = node.getAttribute('data-id');
            nodeType = node.classList[1].split('-');
            nodeType = nodeType[nodeType.length - 1];
            titleNodeType = nodeType && capitalize(nodeType);
          }
          return (
            <>
              <div className='relative z-50 inline-block text-left'>
                <ul className='absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-dark-300 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                  <div className='py-1'>
                    <div>
                      <div
                        href='#'
                        className={classNames(
                          false ? 'bg-slate-500 text-slate-400' : 'text-slate-400',
                          'group flex items-center px-4 py-2 text-sm font-display'
                        )}
                      >
                        <span className='text-slate-400 font-semibold font-display mr-3'>ID: </span>
                        {node ? parentId : 'No node selected'}
                        {nodeType && titleNodeType && (
                          <span className='inline-flex ml-auto items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800'>
                            {titleNodeType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {nodeType === 'domain' && (
                    <DomainNodeContext
                      parentId={parentId}
                      node={node}
                      nodeData={nodeData}
                      nodeType={nodeType}
                      addNode={addNode}
                      addEdge={addEdge}
                      getId={getId}
                      reactFlowInstance={reactFlowInstance}
                    />
                  )}
                  {nodeType === 'email' && (
                    <EmailNodeContext
                      parentId={parentId}
                      node={node}
                      nodeData={nodeData}
                      nodeType={nodeType}
                      addNode={addNode}
                      addEdge={addEdge}
                      getId={getId}
                      reactFlowInstance={reactFlowInstance}
                    />
                  )}
                     {nodeType === 'cse' && (
                    <CseNodeContext
                      parentId={parentId}
                      node={node}
                      nodeData={nodeData}
                      nodeType={nodeType}
                      addNode={addNode}
                      addEdge={addEdge}
                      getId={getId}
                      reactFlowInstance={reactFlowInstance}
                    />
                  )}
                  {nodeType === 'ip' && (
                    <IpNodeContext
                      parentId={parentId}
                      node={node}
                      nodeData={nodeData}
                      nodeType={nodeType}
                      addNode={addNode}
                      addEdge={addEdge}
                      getId={getId}
                      reactFlowInstance={reactFlowInstance}
                    />
                  )}
                  {nodeType === 'result' && (
                    <ResultNodeContext
                      parentId={parentId}
                      node={node}
                      nodeData={nodeData}
                      nodeType={nodeType}
                      addNode={addNode}
                      addEdge={addEdge}
                      getId={getId}
                      reactFlowInstance={reactFlowInstance}
                    />
                  )}
                  {nodeType === 'google' && (
                    <GoogleNodeContext
                      parentId={parentId}
                      node={node}
                      nodeData={nodeData}
                      nodeType={nodeType}
                      addNode={addNode}
                      addEdge={addEdge}
                      getId={getId}
                      reactFlowInstance={reactFlowInstance}
                    />
                  )}
                  {nodeType === 'url' && (
                    <UrlNodeContext
                      parentId={parentId}
                      node={node}
                      nodeData={nodeData}
                      nodeType={nodeType}
                      addNode={addNode}
                      addEdge={addEdge}
                      getId={getId}
                      reactFlowInstance={reactFlowInstance}
                    />
                  )}
                  {nodeType === 'username' && (
                    <UsernameNodeContext
                      parentId={parentId}
                      node={node}
                      nodeData={nodeData}
                      nodeType={nodeType}
                      addNode={addNode}
                      addEdge={addEdge}
                      getId={getId}
                      reactFlowInstance={reactFlowInstance}
                    />
                  )}
                  {nodeType === 'profile' && (
                    <ProfileNodeContext
                      parentId={parentId}
                      node={node}
                      nodeData={nodeData}
                      nodeType={nodeType}
                      addNode={addNode}
                      addEdge={addEdge}
                      getId={getId}
                      reactFlowInstance={reactFlowInstance}
                    />
                  )}
                  {nodeType && (
                    <div className='node-context'>
                      <div>
                        <button onClick={() => deleteNode(parentId)} type='button'>
                          <TrashIcon aria-hidden='true' />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                  {!nodeType && (
                    <div className='node-context'>
                      <div>
                        <button onClick={() => zoomIn && zoomIn({ duration: 200 })} type='button'>
                          <MagnifyingGlassPlusIcon aria-hidden='true' />
                          Zoom in
                        </button>
                      </div>
                      <div>
                        <button onClick={() => zoomOut && zoomOut({ duration: 200 })} type='button'>
                          <MagnifyingGlassMinusIcon aria-hidden='true' />
                          Zoom out
                        </button>
                      </div>
                    </div>
                  )}
                </ul>
              </div>
            </>
          );
        }}
      />
    </HotKeys>
  );
}
