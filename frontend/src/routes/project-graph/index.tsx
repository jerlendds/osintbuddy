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
import CommandPallet from '@/routes/project-graph/_components/CommandPallet';
import ContextMenu from './_components/ContextMenu';
import api, { WS_URL } from '@/services/api.service';
import { getLayoutedElements } from './utils';
import BaseNode from './BaseNode';
import ContextAction from './_components/ContextAction';
import { toast } from 'react-toastify';
import createGLShell from 'gl-now';
import createShader from 'gl-shader';
import createBuffer from 'gl-buffer';
import { nodesService } from '@/services';

const fitViewOptions: FitViewOptions = {
  padding: 50,
};

const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('@todo drag stop update position', node);

const ProjectGraph = ({
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
  onNodeContextMenu,
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
      const flowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const label = event.dataTransfer.getData('application/reactflow');
      if (typeof label === 'undefined' || !label) {
        return;
      }
      const position = reactFlowInstance.project({
        x: event.clientX - flowBounds.left,
        y: event.clientY - flowBounds.top,
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
    [reactFlowInstance]
  );

  const nodeTypes = useMemo(() => {
    return {
      base: (data) => (
        <BaseNode node={data} setEditState={setEditState} updateNode={updateNode} sendJsonMessage={sendJsonMessage} />
      ),
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={reactFlowWrapper}>
      <ReactFlow
        minZoom={0.2}
        maxZoom={2.0}
        nodes={nodes}
        edges={edges}
        onDrop={onDrop}
        onConnect={onConnect}
        onDragOver={onDragOver}
        onEdgeUpdate={onEdgeUpdate}
        onInit={setReactFlowInstance}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeContextMenu={onNodeContextMenu}
        fitView
        fitViewOptions={fitViewOptions}
        nodeTypes={nodeTypes}
        panActivationKeyCode='Space'
        onNodeDragStop={onNodeDragStop}
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
  const { lastMessage, lastJsonMessage, readyState, sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    shouldReconnect: (closeEvent) => {
      return true;
    },
  });

  let zoomIn,
    zoomOut = null;
  if (reactFlowInstance) {
    ({ zoomIn, zoomOut } = reactFlowInstance);
  }

  function addNode(id, data: AddNode, position): void {
    setNodes((nds) =>
      nds.concat({
        id,
        type: 'base',
        data,
        position: reactFlowInstance.project(position),
      })
    );
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
            ?.filter((label: any) => label)
            .map((label: string) => {
              return { event: label, title: label, name: label };
            }) || [];
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
    updatedNode.elements = node.data.elements.map((elm) => {
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
    if (lastJsonMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastJsonMessage));
      if (lastJsonMessage && !Array.isArray(lastJsonMessage)) {
        if (lastJsonMessage?.action === 'addNode') {
          addNodeAction(lastJsonMessage);
          toast.success(`Found 1 ${label.label}`);
        }
        if (lastJsonMessage?.action === 'error') {
          toast.error(`${lastJsonMessage.detail}`);
        }
      } else if (Array.isArray(lastJsonMessage)) {
        lastJsonMessage.map((node, idx) => {
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
        if (lastJsonMessage.length > 0) {
          toast.success(`Found ${lastJsonMessage.length} results`);
        } else {
          toast.info('No results found');
        }
      }
      if (lastJsonMessage.action === 'refresh') {
        toast.info(`Loading plugins...`);
        updateNodeOptions();
      }
    }
  }, [lastMessage, setMessageHistory]);

  const [ctxPosition, setCtxPosition] = useState<XYPosition>({ x: 0, y: 0 });
  const [nodeCtx, setNodeCtx] = useState<JSONObject>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [transforms, setTransforms] = useState<string[]>([]);

  const onNodeContextMenu = (event: MouseEvent, node: Node) => {
    event.preventDefault();
    setNodeCtx(node);

    console.log('setNodeCtx', node);
    nodesService
      .getTransforms({ label: node.data.label })
      .then((data) => {
        setTransforms(data.transforms);
      })
      .catch((error) => {
        toast.error(`Error: ${error}`);
        setTransforms([]);
      });
  };

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
            <ProjectGraph
              onNodeContextMenu={onNodeContextMenu}
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
          transforms={transforms}
          node={nodeCtx}
          position={ctxPosition}
          showMenu={showMenu}
          setShowMenu={setShowMenu}
          ctxPosition={ctxPosition}
          setCtxPosition={setCtxPosition}
          clearCtx={() => {
            console.log('CLEARING CONTEXT')
            setTransforms(null);
            setNodeCtx(null)
          }}
          menu={({ ctx, transforms }) => {
            console.log('ctx???? ', ctx, transforms);
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
                            'group flex items-center py-2 text-sm font-display'
                          )}
                        >
                          <span className='pl-2 text-slate-400 font-semibold font-display mr-3'>ID: </span>
                          {ctx?.id ? ctx.id : 'No node selected'}
                          {ctx?.label && (
                            <span className='inline-flex ml-auto items-center rounded-full whitespace-nowrap truncate bg-dark-400 px-1.5 py-0.5 text-sm font-medium text-blue-800 mr-1'>
                              {ctx.label}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {transforms && (
                      <ContextAction nodeCtx={ctx} sendJsonMessage={sendJsonMessage} transforms={transforms} />
                    )}
                    {ctx?.label ? (
                      <div className='node-context'>
                        <div>
                          <button onClick={() => deleteNode(ctx?.id)} type='button'>
                            <TrashIcon aria-hidden='true' />
                            Delete
                          </button>
                        </div>
                      </div>
                    ) : (
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
