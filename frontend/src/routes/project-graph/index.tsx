// @ts-nocheck
import { useCallback, useState, useRef, useMemo, useEffect } from 'react';
import ReactFlow, { useNodesState, useEdgesState, Edge, XYPosition, Node, FitViewOptions } from 'reactflow';
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
import { nodesService } from '@/services';
import ProjectGraph from './_components/ProjectGraph';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { graphEdges, graphNodes } from '@/features/graph/graphSlice';
import { createNode } from '@/features/graph/graphSlice';

const fitViewOptions: FitViewOptions = {
  padding: 50,
};

const onNodeDragStop = (_: MouseEvent, node: Node) => console.log('@todo drag stop update position', node);


const keyMap = {
  TOGGLE_PALETTE: ['shift+p'],
};


export default function OsintPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const activeProject = location?.state?.activeProject;
  
  const initialNodes = useAppSelector((state) => graphNodes(state))
  const initialEdges = useAppSelector((state) => graphEdges(state))

  const graphRef = useRef<HTMLDivElement>(null);
  const [graphInstance, setGraphInstance] = useState(null);
  
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>(initialEdges);
  const [nodeOptions, setNodeOptions] = useState([]);

  const [showNodeOptions, setShowNodeOptions] = useState<boolean>(false);
  const [editState, setEditState] = useState<boolean>(false);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);

  const [messageHistory, setMessageHistory] = useState([]);
  const [socketUrl, setSocketUrl] = useState(`ws://${WS_URL}/nodes/investigation`);
  const { lastMessage, lastJsonMessage, readyState, sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log('opened'),
    shouldReconnect: (closeEvent) => {
      return true;
    },
  });


  function addNode(id, data: AddNode, position): void {
    setNodes((nds) =>
      nds.concat({
        id,
        type: 'base',
        data,
        position: graphInstance.project(position),
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


  const togglePalette = () => setShowCommandPalette(!showCommandPalette);
  const toggleShowNodeOptions = () => setShowNodeOptions(!showNodeOptions);

  const handlers = {
    TOGGLE_PALETTE: togglePalette,
  };

  // @todo ... https://reactflow.dev/docs/examples/layout/dagre/
  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges, direction);
      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [initialNodes, initialEdges]
  );

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
  const [ctxSelection, setCtxSelection] = useState<JSONObject>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [transforms, setTransforms] = useState<string[]>([]);

  // @todo implement support for multi-select transforms -
  // hm, actually, how will the transforms work if different plugin types/nodes are in the selection?
  const onMultiSelectionCtxMenu = (event: MouseEvent, nodes: Node[]) => {
    event.preventDefault();
  };

  const onSelectionCtxMenu = (event: MouseEvent, node: Node) => {
    event.preventDefault();
    setCtxPosition({
      y: event.clientY - 20,
      x: event.clientX - 20,
    });
    setCtxSelection(node);
    nodesService
      .getTransforms({ label: node.data.label })
      .then((data) => {
        setTransforms(data.transforms);
      })
      .catch((error) => {
        toast.error(
          `We ran into an error loading transforms from the plugin ${node.data.label}. Please file a bug with the plugin author.`
        );
        setTransforms([]);
      });
    setShowMenu(true);
  };

  const onPaneCtxMenu = (event: MouseEvent) => {
    console.log('onPaneCtxMenu');
    event.preventDefault();
    setCtxSelection(null);
    setTransforms(null);
    setShowMenu(true);
    setCtxPosition({
      x: event.clientX - 25,
      y: event.clientY - 25,
    });
  };

  const onPaneClick = () => {
    setShowMenu(false);
    setTransforms(null);
    setCtxSelection(null);
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
            <div style={{ width: '100%', height: '100%' }} ref={graphRef}>
              <ProjectGraph
                onSelectionCtxMenu={onSelectionCtxMenu}
                onMultiSelectionCtxMenu={onMultiSelectionCtxMenu}
                onPaneCtxMenu={onPaneCtxMenu}
                onPaneClick={onPaneClick}
                addEdge={addEdge}
                graphRef={graphRef}
                nodes={initialNodes}
                setNodes={setNodes}
                onNodesChange={onNodesChange}
                edges={initialEdges}
                setEdges={setEdges}
                onEdgesChange={onEdgesChange}
                graphInstance={graphInstance}
                setGraphInstance={setGraphInstance}
                sendJsonMessage={sendJsonMessage}
                lastMessage={lastMessage}
                updateNode={updateNode}
                setEditState={setEditState}
              />
            </div>
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
        />
        <ContextMenu
          transforms={transforms}
          ctxSelection={ctxSelection}
          showMenu={showMenu}
          ctxPosition={ctxPosition}
          closeMenu={() => setShowMenu(false)}
        />
      </HotKeys>
    </>
  );
}
