// @ts-nocheck
import { useCallback, useState, useRef, useMemo, useEffect, createRef } from 'react';
import ReactFlow, {
  Controls,
  useNodesState,
  ReactFlowProvider,
  useEdgesState,
  Edge,
  HandleProps,
  XYPosition,
  useReactFlow,
} from 'reactflow';
import { TrashIcon } from '@heroicons/react/24/outline';
import { HotKeys } from 'react-hotkeys';
import { useLocation, useParams } from 'react-router-dom';
import 'reactflow/dist/style.css';
import classNames from 'classnames';
import BreadcrumbHeader from './_components/BreadcrumbHeader';
import NodeOptions from './_components/NodeOptions';
import CommandPallet from '@/routes/osint/_components/CommandPallet';
import { GoogleNode, GoogleNodeContext } from './_nodes/GoogleNode';
import { CseNode } from './_nodes/CseNode';
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
import { UserResultNode } from './_nodes/UserResult';


const fitViewOptions: FitViewOptions = {
  padding: 50,
};

export var nodeId = 0;

export const getId = (): NodeId => {
  nodeId++;
  return `n_${nodeId}`;
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
        id: `${type.charAt(0)}${getId()}`,
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
      userresult: (data) => <UserResultNode addNode={addNode} addEdge={addEdge} flowData={data} />,
      geo: (data) => <GeoNode flowData={data} />,
      urlscan: (data) => <UrlScanNode flowData={data} />,
      traceroute: (data) => <TracerouteNode flowData={data} />,
      username: (data) => <UsernameNode flowData={data} />,
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlowProvider>
        <div style={{ width: '100%', height: '100%' }} ref={reactFlowWrapper}>
          <ReactFlow
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
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
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

  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodeId, setNodeId] = useState<number>(0);
  let setViewport, zoomIn, zoomOut = null;
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
      type: type || 'smoothstep',
    };
    setEdges((eds) => eds.concat(newEdge));
  }

  function deleteNode(nodeId: NodeId): void {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
  }
  // https://reactflow.dev/docs/examples/layout/dagre/
  const location = useLocation();
  const activeCase = location.state.activeCase;

  const [showNodeOptions, setShowNodeOptions] = useState<boolean>(false);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);

  const togglePalette = () => setShowCommandPalette(!showCommandPalette);
  const toggleShowNodeOptions = () => setShowNodeOptions(!showNodeOptions);

  const handlers = {
    TOGGLE_PALETTE: togglePalette,
  };

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <div className='h-screen flex flex-col w-full'>
        <BreadcrumbHeader activeProject={activeCase.name} />
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
                <ul className='absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                  <div className='py-1'>
                    <div>
                      <div
                        href='#'
                        className={classNames(
                          false ? 'bg-light-500 text-gray-900' : 'text-gray-700',
                          'group flex items-center px-4 py-2 text-sm font-display'
                        )}
                      >
                        <span className='text-dark-900 font-semibold font-display mr-3'>ID: </span>
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
                  {nodeType && (
                    <div className='py-1'>
                      <div>
                        <button
                          onClick={() => deleteNode(parentId)}
                          type='button'
                          className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
                        >
                          <TrashIcon
                            className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500'
                            aria-hidden='true'
                          />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                  {!nodeType && (
                    <div className='py-1'>
                      <div>
                        <button
                          onClick={() => zoomIn && zoomIn({ duration: 200 })}
                          type='button'
                          className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
                        >
                          <TrashIcon
                            className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500'
                            aria-hidden='true'
                          />
                          Zoom in
                        </button>
                      </div>
                      <div>
                        <button
                          onClick={() => zoomOut && zoomOut({ duration: 200 })}
                          type='button'
                          className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
                        >
                          <TrashIcon
                            className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500'
                            aria-hidden='true'
                          />
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
