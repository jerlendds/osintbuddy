import { useState, useRef, useEffect } from 'react';
import { Edge, XYPosition, Node } from 'reactflow';
import { HotKeys } from 'react-hotkeys';
import { useParams } from 'react-router-dom';
import useWebSocket, { ReadyState, SendMessage } from 'react-use-websocket';
import 'reactflow/dist/style.css';
import EntityOptions from './_components/EntityOptions';
import ContextMenu from './_components/ContextMenu';
import { toast } from 'react-toastify';
import ProjectGraph from './_components/ProjectGraph';
import { useAppDispatch, useAppSelector, useComponentVisible, useEffectOnce } from '@/app/hooks';
import {
  ProjectViewModes,
  createEdge,
  createNode,
  graphEdges,
  graphNodes,
  resetGraph,
  selectEditId,
  selectNode,
  selectViewMode,
} from '@/features/graph/graphSlice';
import DisplayOptions from './_components/DisplayOptions';
import { MiniEditDialog } from './_components/BaseMiniNode';
import { WS_URL } from '@/app/baseApi';
import CommandPallet from './_components/CommandPallet';
import { useGetGraphQuery } from '@/app/api';
import RoundLoader from '@/components/Loaders';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';

const keyMap = {
  TOGGLE_PALETTE: ['shift+p'],
};

interface UseWebsocket {
  lastJsonMessage: JSONObject
  readyState: ReadyState
  sendJsonMessage: SendJsonMessage
  lastMessage: MessageEvent<any> | null
}


export default function OsintPage() {
  const dispatch = useAppDispatch();
  const { hid } = useParams()
  const WS_GRAPH_INQUIRE = `ws://${WS_URL}/node/graph/${hid}`

  const { data: activeGraph, isSuccess, isLoading, isError } = useGetGraphQuery({ hid: hid as string })
  const initialNodes = useAppSelector((state) => graphNodes(state));
  const initialEdges = useAppSelector((state) => graphEdges(state));
  const graphRef = useRef<HTMLDivElement>(null);
  const [graphInstance, setGraphInstance] = useState(null);

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const [nodeOptions, setNodeOptions] = useState([]);
  const [showNodeOptions, setShowNodeOptions] = useState<boolean>(false);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);

  const [messageHistory, setMessageHistory] = useState<JSONObject[]>([]);
  const [socketUrl, setSocketUrl] = useState(`${WS_GRAPH_INQUIRE}`);
  const viewMode = useAppSelector((state) => selectViewMode(state));
  const [shouldConnect, setShouldConnect] = useState(false)

  useEffect(() => {
    if (activeGraph && !socketUrl.includes(activeGraph?.id)) {
      setSocketUrl(`${WS_GRAPH_INQUIRE}/${activeGraph.id}`)
      setShouldConnect(true)
    }
  }, [activeGraph?.id])

  const { lastJsonMessage, readyState, sendJsonMessage, lastMessage }: UseWebsocket = useWebSocket(socketUrl, {
    shouldReconnect: () => shouldConnect,
  });

  useEffectOnce(() => {
    dispatch(resetGraph());
    sendJsonMessage({ action: 'read:node' });
  });

  function addNode(id: string, data: AddNode, position: XYPosition, type: ProjectViewModes = viewMode) {
    dispatch(createNode({ id, data, position, type }));
  }

  function addEdge(
    source: string,
    target: string,
    sourceHandle: string = 'r1',
    targetHandle: string = 'l2',
    type: string = 'default'
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

  const addNodeAction = (node: JSONObject) => {
    const position = node?.position;
    const parentId = node.parentId;
    delete node.action;
    delete node.position;
    delete node.parentId;
    addNode(node.id, node.data, position);
    addEdge(parentId, node.id);
  };

  const updateNodeOptions = () => {
    // sdk.nodes.refreshPlugins().then((data) => {
    //   const options =
    //     data?.plugins
    //       ?.filter((option: any) => option)
    //       .map((option: string) => {
    //         return {
    //           event: option.label,
    //           title: option.label,
    //           description: option.description,
    //           author: option.author,
    //         };
    //       }) || [];
    //   return options;
    // }).then((options) => setNodeOptions(options))
    //   .catch((error: Error) => console.error(error))
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];


  const createNodeUpdate = (node: JSONObject, data: JSONObject) => {
    let updatedNode = { ...node };
    updatedNode.elements = node.data.elements.map((elm: JSONObject) => {
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
      if (lastJsonMessage && lastJsonMessage.action === 'error') toast.error(`${lastJsonMessage.detail}`);
      if (!Array.isArray(lastJsonMessage)) {
        if (lastJsonMessage.action === 'addInitialLoad') {
          lastJsonMessage.nodes.forEach((node: JSONObject, idx: JSONObject) => addNode(node.id.toString(), node.data, node.position));
          lastJsonMessage.edges.forEach((edge: JSONObject) => addEdge(edge.source.toString(), edge.target.toString()));
        }
        if (lastJsonMessage.action === 'addNode') {
          lastJsonMessage.position.x += 560;
          lastJsonMessage.position.y += 140;
          addNodeAction(lastJsonMessage);
          toast.success(`Found 1 result`);
        }
      } else if (Array.isArray(lastJsonMessage)) {
        lastJsonMessage.map((node, idx) => {
          if (node?.action === 'addNode') {
            const isOdd = idx % 2 === 0;
            const pos = node.position;
            const x = isOdd ? pos.x + 560 : pos.x + 970;
            const y = isOdd ? pos.y - (idx - 4) * 120 : pos.y - (idx - 3.5) * 120;
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
  }, [lastJsonMessage, setMessageHistory]);

  const [ctxPosition, setCtxPosition] = useState<XYPosition>({ x: 0, y: 0 });
  const [ctxSelection, setCtxSelection] = useState<JSONObject | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTransformLabel, setActiveTransformLabel] = useState<string | null>(null)
  // @todo implement support for multi-select transforms -
  // hm, actually, how will the transforms work if different plugin types/nodes are in the selection?
  // just delete?
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
    setActiveTransformLabel(node.data.label)
    setShowMenu(true);
  };

  const onPaneCtxMenu = (event: MouseEvent) => {
    event.preventDefault();
    setCtxSelection(null);
    setShowMenu(true);
    setCtxPosition({
      x: event.clientX - 25,
      y: event.clientY - 25,
    });
  };


  const onPaneClick = () => {
    setShowMenu(false);
    setCtxSelection(null);
  };

  const { ref, isOpen, setIsOpen } = useComponentVisible(false);
  const activeNodeId = useAppSelector((state) => selectEditId(state));
  const activeNode = useAppSelector((state) => selectNode(state, activeNodeId));

  return (
    <>
      {isError && (
        <h2>Error</h2>
      )}
      {isLoading && (
        <RoundLoader />
      )}
      {isSuccess && (
        <HotKeys keyMap={keyMap} handlers={handlers}>
          <div className='h-screen flex flex-col border-l border-mirage-950 w-full'>
            <EntityOptions activeProject={activeGraph} options={nodeOptions} />
            <div className='h-full w-full justify-between  bg-mirage-800/70'>
              <DisplayOptions />
              <div style={{ width: '100%', height: '100vh' }} ref={graphRef}>

                <MiniEditDialog
                  setIsOpen={setIsOpen}
                  closeRef={ref}
                  isOpen={isOpen}
                  activeNode={activeNode}
                  nodeId={activeNodeId}
                  sendJsonMessage={sendJsonMessage}
                />

                <ProjectGraph
                  activeProject={activeGraph}
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
                  setIsEditingMini={setIsOpen}
                />
              </div>
            </div>
          </div>
          <CommandPallet
            isOpen={showCommandPalette}
            setOpen={setShowCommandPalette}
          />
          <div
            id='node-options-tour'
            className='absolute top-[3.5rem] w-48 bg-red -z-10 h-20 left-[0.7rem] text-slate-900'
          />
          <ContextMenu
            activeTransformLabel={activeTransformLabel}
            sendJsonMessage={sendJsonMessage}
            ctxSelection={ctxSelection}
            showMenu={showMenu}
            ctxPosition={ctxPosition}
            closeMenu={() => setShowMenu(false)}
          />
        </HotKeys>
      )}
    </>
  );
}
