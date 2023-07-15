// @ts-nocheck
import { useCallback, useState, useRef, useEffect } from 'react';
import { Edge, XYPosition, Node } from 'reactflow';
import { HotKeys } from 'react-hotkeys';
import { useLocation } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import 'reactflow/dist/style.css';
import EntityOptions from './_components/EntityOptions';
import CommandPallet from '@/routes/project-graph/_components/CommandPallet';
import ContextMenu from './_components/ContextMenu';
import api, { WS_URL } from '@/services/api.service';
import { getLayoutedElements } from './utils';
import { toast } from 'react-toastify';
import { nodesService } from '@/services';
import ProjectGraph from './_components/ProjectGraph';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createEdge, createNode, graphEdges, graphNodes, resetGraph } from '@/features/graph/graphSlice';
import { useEffectOnce } from '@/components/utils';
import DisplayOptions from './_components/DisplayOptions';

const keyMap = {
  TOGGLE_PALETTE: ['shift+p'],
};

export default function OsintPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const activeProject = location?.state?.activeProject;
  const initialNodes = useAppSelector((state) => graphNodes(state));
  const initialEdges = useAppSelector((state) => graphEdges(state));
  const graphRef = useRef<HTMLDivElement>(null);
  const [graphInstance, setGraphInstance] = useState(null);

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [nodeOptions, setNodeOptions] = useState([]);
  const [showNodeOptions, setShowNodeOptions] = useState<boolean>(false);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);

  const [messageHistory, setMessageHistory] = useState([]);
  const projectUUID = activeProject.uuid.replace('-', '');
  const [socketUrl, setSocketUrl] = useState(`ws://${WS_URL}/nodes/project/${projectUUID}`);
  const traversalId = activeProject.uuid.replaceAll(/\-/g, '');

  const { lastMessage, lastJsonMessage, readyState, sendJsonMessage } = useWebSocket(socketUrl, {
    onOpen: () => console.log(`opening traversal: \n\tproject_${traversalId}_traversal`),
    shouldReconnect: () => true,
  });

  useEffectOnce(() => {
    dispatch(resetGraph())
    sendJsonMessage({ action: 'read:node' })
  });

  function addNode(id, data: AddNode, position) {
    dispatch(createNode({ id, data, position, type: 'base' }));
  }

  function addEdge(
    source,
    target,
    sourceHandle?: string = 'r1',
    targetHandle?: string = 'l2',
    type?: string = 'default'
  ): void {
    dispatch(
      createEdge({
        source,
        target,
        sourceHandle,
        targetHandle,
        type,
      })
    );
  }

  const togglePalette = () => setShowCommandPalette(!showCommandPalette);
  const toggleShowNodeOptions = () => setShowNodeOptions(!showNodeOptions);

  const handlers = {
    TOGGLE_PALETTE: togglePalette,
  };

  // @todo ... https://reactflow.dev/docs/examples/layout/dagre/
  // const onLayout = useCallback(
  //   (direction) => {
  //     const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges, direction);
  //     setNodes([...layoutedNodes]);
  //     setEdges([...layoutedEdges]);
  //   },
  //   [initialNodes, initialEdges]
  // );

  const addNodeAction = (node) => {
    const position = node?.position;
    const parentId = node.parentId;
    delete node.action;
    delete node.position;
    delete node.parentId;
    addNode(node.id, node.data, position);
    addEdge(parentId, node.id);
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

  const createNodeUpdate = (node: JSONObject, data) => {
    let updatedNode = { ...node };
    updatedNode.elements = node.data.elements.map((elm) => {
      // @todo refactor me to `find`
      if (Object.keys(data)[0] === elm.label) {
        elm.value = data[elm.label];
      }
      return elm;
    });
    return updatedNode;
  };

  // websocket updates happen here
  useEffect(() => {
    if (lastJsonMessage) {
      setMessageHistory((prev) => prev.concat(lastJsonMessage));
      if (lastJsonMessage.action === 'error') toast.error(`${lastJsonMessage.detail}`);
      if (!Array.isArray(lastJsonMessage)) {
        if (lastJsonMessage.action === 'addInitialLoad') {
          lastJsonMessage.nodes.forEach((node, idx) => addNode(
            node.id.toString(),
            node.data,
            node.position
          ));
          lastJsonMessage.edges.forEach((edge) => addEdge(edge.source.toString(), edge.target.toString()));
        }
        if (lastJsonMessage.action === 'addNode') {
          lastJsonMessage.position.x += 520;
          lastJsonMessage.position.y += 100;
          addNodeAction(lastJsonMessage);
          toast.success(`Found 1 ${label.label}`);
        }
      } else if (Array.isArray(lastJsonMessage)) {
        lastJsonMessage.map((node, idx) => {
          if (node?.action === 'addNode') {
            const isOdd = idx % 2 === 0;
            const pos = node.position;
            const x = isOdd ? pos.x + 530 : pos.x + 1020;
            const y = isOdd ? (idx - 1) * 120 + pos.y : idx * 120 + pos.y;
            node.position = {
              x,
              y,
            };
            sendJsonMessage({ action: 'update:node', node: { id: node.id, x } });
            sendJsonMessage({ action: 'update:node', node: { id: node.id, y } });
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
          <div className='flex h-full justify-between bg-dark-900 relative'>
              <DisplayOptions />
            <div style={{ width: '100%', height: '100vh' }} ref={graphRef}>
              <EntityOptions activeProject={activeProject} options={nodeOptions} />
              <ProjectGraph
                activeProject={activeProject}
                onSelectionCtxMenu={onSelectionCtxMenu}
                onMultiSelectionCtxMenu={onMultiSelectionCtxMenu}
                onPaneCtxMenu={onPaneCtxMenu}
                onPaneClick={onPaneClick}
                addEdge={addEdge}
                graphRef={graphRef}
                nodes={initialNodes}
                setNodes={setNodes}
                edges={initialEdges}
                setEdges={setEdges}
                graphInstance={graphInstance}
                setGraphInstance={setGraphInstance}
                sendJsonMessage={sendJsonMessage}
                lastMessage={lastMessage}
                updateNode={createNodeUpdate}
                setNodes={setNodes}
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
          sendJsonMessage={sendJsonMessage}
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
