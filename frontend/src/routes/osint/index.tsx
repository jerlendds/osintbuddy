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
} from 'reactflow';
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { HotKeys } from 'react-hotkeys';
import { useLocation } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import 'reactflow/dist/style.css';
import classNames from 'classnames';
import BreadcrumbHeader from './_components/BreadcrumbHeader';
import NodeOptions from './_components/NodeOptions';
import CommandPallet from '@/routes/osint/_components/CommandPallet';
import ContextMenu from './_components/ContextMenu';
import api, { WS_URL } from '@/services/api.service';
import { getLayoutedElements } from './utils';
import BaseNode from './BaseNode';
import ContextAction from './_components/ContextAction';
import { toast } from 'react-toastify';
import { JSONObject } from '@/globals';
import createGLShell from 'gl-now';
import createShader from 'gl-shader';
import createBuffer from 'gl-buffer';

export var nodeId = 0;

export const getId = (): NodeId => {
  nodeId++;
  return `n_${nodeId}`;
};

const fitViewOptions: FitViewOptions = {
  padding: 50,
};

const InvestigationFlow = ({
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
  sendJsonMessage,
  messageHistory,
  lastMessage,
  updateNode,
  setEditState,
}: JSONObject) => {
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
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      console.log('type: ', type);
      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }
      const position = reactFlowInstance.project({
        x: event.clientX,
        y: event.clientY,
      });
      const nodeElements = await api.get(`/nodes/type?node_type=${type}`);
      console.log('nodes:: ', nodeElements);
      if (nodeElements?.data) {
        const newNode = {
          id: `${getId()}`,
          type: 'base',
          position,
          data: {
            node: nodeElements?.data,
          },
        };
        sendJsonMessage({ action: 'create:node', node: newNode });
        setNodes((nds) => nds.concat(newNode));
      }
    },
    [reactFlowInstance, nodeId]
  );

  const nodeTypes = useMemo(() => {
    return {
      base: (data) => (
        <BaseNode setEditState={setEditState} updateNode={updateNode} sendJsonMessage={sendJsonMessage} flow={data} />
      ),
    };
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    switch (e.detail) {
      case 1:
        // @ts-ignore
        // console.log('node click', e.target, e?.target?.closest('.react-flow__node input'));
        break;
      case 2:
        // @ts-ignore
        // console.log('node double click', e?.target?.closest('.react-flow__node'));
        break;
      case 3:
        // @ts-ignore
        // console.log('node triple click', e.target);
        break;
    }
  };


  return (
    <div onClick={handleClick} style={{ width: '100%', height: '100%' }} ref={reactFlowWrapper}>
      <ReactFlow
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
        panActivationKeyCode='Space'
      >
        <Background variant={BackgroundVariant.Dots} className='bg-dark-[rgb(10 15 20)]' color='#1F3057' />
        <Controls />
      </ReactFlow>
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
  const [nodeOptions, setNodeOptions] = useState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  const [showNodeOptions, setShowNodeOptions] = useState<boolean>(false);
  const [editState, setEditState] = useState<boolean>(false);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);
  const location = useLocation();
  const activeProject = location?.state?.activeProject;

  const [messageHistory, setMessageHistory] = useState([]);
  const [socketUrl, setSocketUrl] = useState(`ws://${WS_URL}/nodes/investigation`);
  const { lastMessage, readyState, sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    shouldReconnect: (closeEvent) => {
      console.log('closeEvent: ', closeEvent);
      return true;
    },
  });

  let setViewport,
    zoomIn,
    zoomOut = null;
  if (reactFlowInstance) {
    ({ setViewport, zoomIn, zoomOut } = reactFlowInstance);
  }

  function addNode(id, data: AddNode, position): Node<XYPosition> {
    let addPosition = null;
    if (reactFlowInstance) {
      addPosition = reactFlowInstance.project(position);
    } else {
      addPosition = position;
    }

    const newNode = {
      id,
      type: 'base',
      data,
      position: addPosition,
    };
    console.log('ADDING NODE: ', newNode);
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

  const togglePalette = () => setShowCommandPalette(!showCommandPalette);
  const toggleShowNodeOptions = () => setShowNodeOptions(!showNodeOptions);

  const handlers = {
    TOGGLE_PALETTE: togglePalette,
  };

  // https://reactflow.dev/docs/examples/layout/dagre/
  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges, direction);
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );

  // const updateNodeOptions = () => {
  //   setIsRefresh(isRefresh.length > 3 ? "" : isRefresh + "x");
  // };

  const addNodeAction = (node) => {
    const newId = getId();
    const position = node?.position;
    const parentId = node.parentId;
    delete node.action;
    delete node.position;
    delete node.parentId;
    addNode(newId, { node }, position);
    addEdge(parentId, newId);
  };

  const updateNodeOptions = () => {
    api
      .get('/nodes/refresh')
      .then((resp) => {
        const options =
          resp?.data?.plugins
            ?.filter((pluginLabel: any) => pluginLabel)
            .map((label: string) => {
              return { event: label, title: label, name: label };
            }) || [];
        console.log('options: ', options);
        return options;
      })
      .then((options) => setNodeOptions(options));
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const updateNode = (node: JSONObject, data) => {
    let updatedNode = { ...node };
    updatedNode.elements = node.data.node.elements.map((elm) => {
      if (Object.keys(data)[0] === elm.label) {
        elm.value = data[elm.label];
      }
      return elm;
    });
    return updatedNode;
  };

  // user edits updates happen here
  useEffect(() => {
    if (editState) {
      setNodes((nds) =>
        nds.map((node) => {
          console.log(node.id, nodeId, editState);
          if (editState && editState.data && node.id === editState.id) {
            node = updateNode(node, editState.data);
          }
          return node;
        })
      );
    }
  }, [editState, setNodes]);

  // websocket updates happen here
  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
      let data = JSON.parse(lastMessage?.data) || lastMessage?.data;
      console.log('lastMessage: ', data);
      if (data && !Array.isArray(data)) {
        if (data?.action === 'addNode') {
          addNodeAction(data);
          toast.success(`Found 1 ${node.label}`);
        }
        if (data?.action === 'error') {
          toast.error(`${data.detail}`);
        }
        if (data?.action === 'refresh') {
          toast.info(`Loading plugins...`);
          updateNodeOptions();
        }
      } else if (Array.isArray(data)) {
        data = data.map((node, idx) => {
          if (node?.action === 'addNode') {
            const isOdd = idx % 2 === 0;
            const pos = node.position;
            node.position = {
              x: isOdd ? pos.x + 60 : pos.x + 370,
              y: isOdd ? (idx - 1) * 70 + pos.y : idx * 70 + pos.y,
            };
            addNodeAction(node);
          }
        });
        if (data.length > 0) {
          toast.success(`Found ${data.length} results`);
        } else {
          toast.info('No results found');
        }
      }
    }
  }, [lastMessage, setMessageHistory]);


  return (
    <>
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <div className='h-screen flex flex-col w-full'>
          <BreadcrumbHeader
            updateNodeOptions={updateNodeOptions}
            nodeOptions={nodeOptions}
            onLayout={onLayout}
            description={activeProject?.description}
            activeProject={activeProject?.name || 'Unknown'}
          />
          <div className='flex h-full justify-between bg-dark-900 relative'>
            <NodeOptions key={nodeOptions.length.toString()} options={nodeOptions} />
            <InvestigationFlow
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
              sendJsonMessage={sendJsonMessage}
              messageHistory={messageHistory}
              lastMessage={lastMessage}
              updateNode={updateNode}
              setEditState={setEditState}
            />
          </div>
        </div>
     

        <CommandPallet
          toggleShowOptions={toggleShowNodeOptions}
          isOpen={showCommandPalette}
          setOpen={setShowCommandPalette}
        />
        <div
          id='node-options-tour'
          className='absolute top-[3.5rem] w-48 bg-red -z-10 h-20 left-[0.7rem] text-slate-900'
        ></div>
        <ContextMenu
          menu={({ node }) => {
            let parentId = null;
            let nodeData = null;
            let nodeType = null;

            if (node) {
              nodeData = [...node.querySelectorAll('[data-node]')].map((node) =>
                node?.value ? node.value : node?.textContent
              );
              parentId = node.getAttribute('data-id');
              nodeType = node.querySelector('[data-node-type]').getAttribute('data-node-type');
            }
            return (
              <>
                <div className='relative z-50 inline-block text-left'>
                  <div className='absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-dark-300 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
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
                          {nodeType && (
                            <span className='inline-flex ml-auto items-center rounded-full bg-blue-100 px-3 py-0.5 text-sm font-medium text-blue-800'>
                              {nodeType}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <ContextAction
                      node={node}
                      parentId={parentId}
                      nodeData={nodeData}
                      nodeType={nodeType}
                      addEdge={addEdge}
                      addNode={addNode}
                      deleteNode={deleteNode}
                      sendJsonMessage={sendJsonMessage}
                    />
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
                  </div>
                </div>
              </>
            );
          }}
        />
      </HotKeys>
    </>
  );
}
