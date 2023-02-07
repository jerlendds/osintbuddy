// @ts-nocheck
import React, { useCallback, useState, useRef, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  ReactFlowProvider,
  useEdgesState,
} from 'reactflow';
import { EllipsisVerticalIcon, HomeIcon } from '@heroicons/react/20/solid';
import { HotKeys } from 'react-hotkeys';
import { Link, Route, Routes, useLocation, useParams } from 'react-router-dom';
import 'reactflow/dist/style.css';
import CommandPallet from '@/routes/osint/CommandPallet';
import CustomNode from './CustomNode';
import classNames from 'classnames';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';
import NodeOptionsSlideOver from './_components/NodeOptionsSlideOver';
import { GoogleNode, CseNode, WebsiteNode, ResultNode } from './_components/Nodes';

let id = 0;
const getId = () => `gnode_${id++}`;

const keyMap = {
  TOGGLE_PALLET: ['shift+p'],
};

function SimpleCard() {
  const project = { name: 'Graph API', initials: 'GA', href: '#', members: 16, bgColor: 'bg-pink-600' };
  return (
    <div>
      <h2 className='text-sm font-medium text-gray-500'>Pinned Projects</h2>
      <ul role='list' className='mt-3 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4'>
        <li key={project.name} className='col-span-1 flex rounded-md shadow-sm'>
          <div
            className={classNames(
              project.bgColor,
              'flex-shrink-0 flex items-center justify-center w-16 text-white text-sm font-medium rounded-l-md'
            )}
          >
            {project.initials}
          </div>
          <div className='flex flex-1 items-center justify-between truncate rounded-r-md border-t border-r border-b border-gray-200 bg-white'>
            <div className='flex-1 truncate px-4 py-2 text-sm'>
              <a href={project.href} className='font-medium text-gray-900 hover:text-gray-600'>
                {project.name}
              </a>
              <p className='text-gray-500'>{project.members} Members</p>
            </div>
            <div className='flex-shrink-0 pr-2'>
              <button
                type='button'
                className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-white bg-transparent text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
              >
                <span className='sr-only'>Open options</span>
                <EllipsisVerticalIcon className='h-5 w-5' aria-hidden='true' />
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

function BreadcrumbHeader({
  activeProject,
  toggleShowOptions,
}: {
  activeProject: string;
  toggleShowOptions: Function;
}) {
  const pages = [
    { name: 'Investigations', href: '#', current: false },
    { name: activeProject, href: '#', current: true },
  ];
  return (
    <nav
      className='flex justify-between fixed top-0 z-40 border-b border-gray-200 bg-dark-800 w-full'
      aria-label='Breadcrumb'
    >
      <ol role='list' className='flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8'>
        <li className='flex'>
          <div className='flex items-center'>
            <Link to='/app/dashboard' replace className='text-gray-400 hover:text-light-500'>
              <HomeIcon className='h-5 w-5 flex-shrink-0' aria-hidden='true' />
              <span className='sr-only'>Home</span>
            </Link>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name} className='flex'>
            <div className='flex items-center'>
              <svg
                className='h-full w-6 flex-shrink-0 text-gray-300'
                viewBox='0 0 24 44'
                preserveAspectRatio='none'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path d='M.293 0l22 22-22 22h1.414l22-22-22-22H.293z' />
              </svg>
              <button
                className='ml-4 text-sm font-medium text-light-500 hover:text-light-700'
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </button>
            </div>
          </li>
        ))}
        <button
          type='button'
          onClick={() => toggleShowOptions()}
          className='leading-3 ml-auto relative inline-flex items-center rounded border border-gray-300 bg-white px-2.5  text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
        >
          Add nodes
        </button>
      </ol>
    </nav>
  );
}
const tabs = [
  { name: 'Google Search', href: 'gsearch', current: true },
  { name: 'CSE Search', href: 'cses', current: false },
  { name: 'Nodes', href: 'nodes', current: false },
];

const initialEdges = [];
const initialNodes = [];

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

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
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  function addNode(id, type, position, data) {
    const newNode = {
      id,
      type,
      position,
      data,
    };
    setNodes((nds) => nds.concat(newNode));
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

  const nodeTypes = useMemo(() => {
    return {
      website: () => <WebsiteNode id={getId()} data={'TODO: Add website node'} />,
      google: (data) => <GoogleNode id={getId()} addNode={addNode} addEdge={addEdge} flowData={data} />,
      cse: () => <CseNode id={getId()} data={'TODO: Add cse node'} />,
      result: (data) => <ResultNode id={getId()} data={data} />,
    };
  }, []);

  return (
    <div className='dndflow' style={{ width: '100%', height: '100%' }}>
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
  const params = useParams();
  const location = useLocation();
  const activeCase = location.state.activeCase;

  const [showNodeOptions, setShowNodeOptions] = useState<boolean>(false);
  const [showCommandPallet, setShowCommandPallet] = useState<boolean>(false);

  const [activePanelTab, setActivePanelTab] = useState<string>(tabs[0].name);
  console.log(params, activeCase);

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
        <BreadcrumbHeader toggleShowOptions={toggleShowNodeOptions} activeProject={activeCase.name} />
        <div className='flex h-full'>
          <DnDFlow />
        </div>

        <CommandPallet
          toggleShowOptions={toggleShowNodeOptions}
          isOpen={showCommandPallet}
          setOpen={setShowCommandPallet}
        />
      </div>
      <NodeOptionsSlideOver showOptions={showNodeOptions} setShowOptions={setShowNodeOptions} />
    </HotKeys>
  );
}
