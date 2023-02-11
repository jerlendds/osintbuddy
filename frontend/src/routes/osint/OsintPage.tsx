// @ts-nocheck
import { useCallback, useState, useRef, useMemo } from 'react';
import ReactFlow, { Controls, useNodesState, ReactFlowProvider, useEdgesState } from 'reactflow';
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

const keyMap = {
  TOGGLE_PALLET: ['shift+p'],
};

const initialEdges = [];
const initialNodes = [];

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
  getId,
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
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      console.log('getting id', getId());
      const newNode = {
        id: `${type.charAt(0)}${getId()}`,
        type,
        position,
        data: { label: `${type} node` },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const nodeTypes = useMemo(() => {
    return {
      dns: (data) => <DnsNode flowData={data} />,
      domain: (data) => <DomainNode flowData={data} />,
      email: (data) => <EmailNode flowData={data} />,
      subdomain: (data) => <SubdomainNode flowData={data} />,
      google: (data) => <GoogleNode addNode={addNode} addEdge={addEdge} flowData={data} />,
      cse: (data) => <CseNode flowData={data} />,
      whois: (data) => <WhoisNode flowData={data} />,
      ip: (data) => <IpNode flowData={data} />,
      result: (data) => <ResultNode addNode={addNode} addEdge={addEdge} flowData={data} />,
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
            nodeTypes={nodeTypes}
          >
            <Controls />
          </ReactFlow>
        </div>
      </ReactFlowProvider>
    </div>
  );
};

export default function OsintPage() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [nodeId, setNodeId] = useState<number>(0);

  const getId = useCallback(() => {
    console.log(nodeId);
    setNodeId(nodeId + 1);
    console.log(nodeId);
    return `node_${nodeId}`;
  }, [nodeId]);

  function addNode(id, type, position, data) {
    const newNode = {
      id,
      type,
      position,
      data,
    };
    setNodes((nds) => nds.concat(newNode));
    return reactFlowInstance?.project(position);
  }

  function addEdge(source, target) {
    const newEdge = {
      source,
      target,
      sourceHandle: 'r1',
      targetHandle: 'l1',
    };
    setEdges((eds) => eds.concat(newEdge));
  }

  function deleteNode(nodeId) {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
  }

  const location = useLocation();
  const activeCase = location.state.activeCase;

  const [showNodeOptions, setShowNodeOptions] = useState<boolean>(false);
  const [showCommandPallet, setShowCommandPallet] = useState<boolean>(false);

  const togglePallet = () => setShowCommandPallet(!showCommandPallet);
  const toggleShowNodeOptions = () => setShowNodeOptions(!showNodeOptions);
  const hideCommandPallet = () => setShowCommandPallet(false);

  const handlers = {
    TOGGLE_PALLET: togglePallet,
    CLOSE_PALLET: hideCommandPallet,
  };

  return (
    <HotKeys keyMap={keyMap} handlers={handlers}>
      <div className='h-screen flex flex-col w-full'>
        <BreadcrumbHeader activeProject={activeCase.name} />
        <div className='flex h-full'>
          <DnDFlow
            getId={getId}
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
          isOpen={showCommandPallet}
          setOpen={setShowCommandPallet}
        />
      </div>
      <NodeOptions />
      <ContextMenu
        menu={({ node }) => {
          const parentId = node.getAttribute('data-id');
          const nodeData = node?.querySelectorAll('[data-type]');
          let nodeType = null;
          if (node) {
            nodeType = node.classList[1].split('-');
            nodeType = nodeType[nodeType.length - 1];
          }
          const titleNodeType = nodeType?.charAt(0).toUpperCase() + nodeType?.slice(1);

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
                        {nodeType && (
                          <span className='inline-flex ml-auto items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800'>
                            {titleNodeType}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {nodeType === 'domain' && (
                    <DomainNodeContext
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
                </ul>
              </div>
            </>
          );
        }}
      />
    </HotKeys>
  );
}
