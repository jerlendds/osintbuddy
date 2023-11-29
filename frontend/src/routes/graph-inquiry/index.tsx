import { useState, useRef, useEffect, useMemo } from 'react';
import { Edge, XYPosition, Node } from 'reactflow';
import { HotKeys } from 'react-hotkeys';
import { useParams } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';
import { forceSimulation, forceLink, forceManyBody, forceX, forceY } from 'd3-force';
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
  selectAllEdges,
  selectPositionMode,
  selectViewMode,
  setAllNodes,
} from '@/features/graph/graphSlice';
import { WS_URL } from '@/app/baseApi';
import CommandPallet from './_components/CommandPallet';
import { useGetGraphQuery } from '@/app/api';
import RoundLoader from '@/components/Loaders';
import { selectAllNodes } from '../../features/graph/graphSlice';

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

  const [nodesBeforeLayout, setNodesBeforeLayout] = useState(initialNodes)
  const [edgesBeforeLayout, setEdgesBeforeLayout] = useState(initialEdges)

  const graphRef = useRef<HTMLDivElement>(null);
  const [graphInstance, setGraphInstance] = useState(null);

  const [nodeOptions, setNodeOptions] = useState([]);
  const [showCommandPalette, setShowCommandPalette] = useState<boolean>(false);

  const [messageHistory, setMessageHistory] = useState<JSONObject[]>([]);
  const [socketUrl, setSocketUrl] = useState(`${WS_GRAPH_INQUIRE}`);
  const viewMode = useAppSelector((state) => selectViewMode(state));
  const [shouldConnect, setShouldConnect] = useState(false)


  useEffect(() => {
    if (activeGraph && !socketUrl.includes(activeGraph?.id)) {
      dispatch(resetGraph());
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

  const handlers = {
    TOGGLE_PALETTE: togglePalette,
  };

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
          lastJsonMessage.nodes.forEach((node: JSONObject, idx: JSONObject) => addNode(node.id.toString(), node.data, node.position, 'mini'));
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

  const positionMode = useAppSelector((state) => selectPositionMode(state))

  const { ref, isOpen, setIsOpen } = useComponentVisible(false);

  const useForceLayoutElements = () => {
    const allNodes = [...useAppSelector(state => selectAllNodes(state))]
    const allEdges = [...useAppSelector(state => selectAllEdges(state))]

    const nodesInitialized = initialNodes.every((node: any) => node.width && node.height)

    return useMemo(() => {
      const simulation = forceSimulation()
        .force('charge', forceManyBody().strength(-4000))
        .force('x', forceX().x(0).strength(0.05))
        .force('y', forceY().y(0).strength(0.05))
        .alphaTarget(0.05)
        .stop();

      setNodesBeforeLayout(allNodes)
      setEdgesBeforeLayout(allEdges)
      let forceNodes = allNodes.map((node: any) => ({ ...node, x: node.position.x, y: node.position.y }));
      let forceEdges = allEdges.map((edge: any) => ({ ...edge }));


      // if no width or height or no nodes in the flow, can't run the simulation!
      if (!nodesInitialized || forceNodes.length === 0) return [false, {} as any];
      let running = false;
      simulation.nodes(forceNodes).force(
        'link',
        forceLink(forceEdges)
          .id((d: any) => d.id)
          .strength(0.05)
          .distance(100)
      );

      // The tick function is called every animation frame while the simulation is
      // running and progresses the simulation one step forward each time.
      const tick = () => {
        forceNodes.forEach((node: any, i: number) => {
          const dragging = Boolean(document.querySelector(`[data-id="${node.id}"].dragging`));

          // Setting the fx/fy properties of a node tells the simulation to "fix"
          // the node at that position and ignore any forces that would normally
          // cause it to move.
          forceNodes[i].fx = dragging ? node.position.x : null;
          forceNodes[i].fy = dragging ? node.position.y : null;
        });

        simulation.tick();
        dispatch(setAllNodes(forceNodes.map((node: any) => ({ ...node, position: { x: node.x, y: node.y } }))) as any);

        window.requestAnimationFrame(() => {
          if (running) tick();
        });
      };

      const toggle = (setForce?: boolean) => {
        if (typeof setForce === 'boolean') {
          running = setForce
        } else {
          running = !running
        }
        running && window.requestAnimationFrame(tick);
      };

      return [true, { toggle, isForceRunning: running }];
    }, [nodesInitialized]);
  }

  const [forceInitialized, { toggle, isForceRunning }] = useForceLayoutElements();
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
          <div className='h-screen flex flex-col w-full'>
            <button id="wtf2"></button>
            <EntityOptions
              positionMode={positionMode}
              toggleForceLayout={toggle}
              isForceActive={isForceRunning}
              activeGraph={activeGraph}
              options={nodeOptions}
              allNodes={nodesBeforeLayout}
              allEdges={edgesBeforeLayout}
            />
            <div className='h-full w-full justify-between bg-mirage-600/95'>
              <div style={{ width: '100%', height: '100vh' }} ref={graphRef}>
                <ProjectGraph
                  activeProject={activeGraph}
                  onSelectionCtxMenu={onSelectionCtxMenu}
                  onMultiSelectionCtxMenu={onMultiSelectionCtxMenu}
                  onPaneCtxMenu={onPaneCtxMenu}
                  onPaneClick={onPaneClick}
                  addEdge={addEdge}
                  graphRef={graphRef}
                  nodes={initialNodes}
                  edges={initialEdges}
                  graphInstance={graphInstance}
                  setGraphInstance={setGraphInstance}
                  sendJsonMessage={sendJsonMessage}
                  lastMessage={lastMessage}
                  updateNode={createNodeUpdate}
                  setIsEditingMini={setIsOpen}
                  isEditingMini={isOpen}
                  closeMiniRef={ref}
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
