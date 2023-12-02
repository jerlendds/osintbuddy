import { useState, useRef, useEffect, useMemo, useCallback, useContext } from 'react';
import { UNSAFE_NavigationContext as NavigationContext, unstable_BlockerFunction } from 'react-router-dom';
import { Edge, XYPosition, Node, ReactFlowInstance, FitView } from 'reactflow';
import { HotKeys } from 'react-hotkeys';
import { useParams, useLocation, useBlocker, useBeforeUnload } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';
import { forceSimulation, forceLink, forceManyBody, forceX, forceY } from 'd3-force';
import 'reactflow/dist/style.css';
import EntityOptions from './_components/EntityOptions';
import ContextMenu from './_components/ContextMenu';
import { toast } from 'react-toastify';
import Graph from './graph/Graph';
import ELK from 'elkjs/lib/elk.bundled.js';
import { useAppDispatch, useAppSelector, useComponentVisible, useEffectOnce } from '@/app/hooks';
import {
  ProjectViewModes,
  createEdge,
  createNode,
  graphEdges,
  graphNodes,
  resetGraph,
  selectAllEdges,
  selectEditId,
  selectPositionMode,
  selectViewMode,
  setAllEdges,
  setAllNodes,
  setPositionMode,
} from '@/features/graph/graphSlice';
import { WS_URL } from '@/app/baseApi';
import CommandPallet from './_components/CommandPallet';
import { useGetGraphQuery } from '@/app/api';
import RoundLoader from '@/components/Loaders';
import { selectAllNodes } from '../../features/graph/graphSlice';
import { useTour } from '@reactour/tour';
import { setGraphTour } from '@/features/account/accountSlice';

const keyMap = {
  TOGGLE_PALETTE: ['shift+p'],
};

interface UseWebsocket {
  lastJsonMessage: JSONObject
  readyState: ReadyState
  sendJsonMessage: SendJsonMessage
  lastMessage: MessageEvent<any> | null
}

interface GraphInquiryProps {
}

let edgeId = 0;

const getEdgeId = () => {
  edgeId += 1
  return `e-tmp-${edgeId}`
}

export default function GraphInquiry({ }: GraphInquiryProps) {
  const dispatch = useAppDispatch();
  const { hid } = useParams()
  const location = useLocation()
  const { setIsOpen: setIsTourOpen, steps, setCurrentStep: setCurrentTourStep } = useTour();

  useEffect(() => {
    if (location.state?.showGraphGuide) {
      setCurrentTourStep(0)
      setIsTourOpen(true)
    }
  }, [])

  const WS_GRAPH_INQUIRE = `ws://${WS_URL}/node/graph/${hid}`

  const { data: activeGraph, isSuccess, isLoading, isError } = useGetGraphQuery({ hid: hid as string })

  useEffect(() => {
    dispatch(setPositionMode('manual'))
  }, [activeGraph?.id])

  const graphRef = useRef<HTMLDivElement>(null);
  const [graphInstance, setGraphInstance] = useState<ReactFlowInstance>();

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
    type: string = 'float',
    label: string = '',
    id: any = getEdgeId()
  ): void {
    dispatch(
      createEdge({
        source,
        target,
        sourceHandle,
        targetHandle,
        type,
        label,
        id
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
          dispatch(setAllNodes(lastJsonMessage.nodes))
          dispatch(setAllEdges(lastJsonMessage.edges))
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


  const initialNodes = useAppSelector((state) => graphNodes(state));
  const initialEdges = useAppSelector((state) => graphEdges(state));

  const [nodesBeforeLayout, setNodesBeforeLayout] = useState(initialNodes)
  const [edgesBeforeLayout, setEdgesBeforeLayout] = useState(initialEdges)
  const [ctxPosition, setCtxPosition] = useState<XYPosition>({ x: 0, y: 0 });
  const [ctxSelection, setCtxSelection] = useState<JSONObject | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTransformLabel, setActiveTransformLabel] = useState<string | null>(null)
  // @todo implement support for multi-select transforms -
  // hm, actually, how will the transforms work if different plugin types/nodes are in the selection?
  // just delete/save position on drag?
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


  let fitView: FitView | undefined;
  if (graphInstance) {
    fitView = graphInstance.fitView
  }

  const activeNodeEditId = useAppSelector(state => selectEditId(state))

  useEffect(() => {
    if (positionMode === 'manual') {
      setNodesBeforeLayout(initialNodes)
      setEdgesBeforeLayout(initialEdges)
    }
  }, [initialNodes, activeNodeEditId])


  // TODO: Also implement d3-hierarchy, entitree-flex, dagre, webcola, and graphology layout modes
  //       Once implemented measure performance and deprecate whatever performs worse
  const elk = new ELK();
  const useElkLayoutElements = () => {
    const defaultOptions = {
      'elk.algorithm': 'layered',
      'elk.layered.spacing.nodeNodeBetweenLayers': 420,
      'elk.spacing.nodeNode': 180,
    };

    const setElkLayout = useCallback((options: any) => {

      const layoutOptions = { ...defaultOptions, ...options };
      const graph = {
        id: 'root',
        layoutOptions: layoutOptions,
        children: nodesBeforeLayout.map((node: any) => ({ ...node })),
        edges: edgesBeforeLayout.map((edge: any) => ({ ...edge, })),
      };
      elk.layout(graph as any).then(({ children, edges }: any) => {
        children.forEach((node: any) => {
          node.position = { x: node.x, y: node.y };
        });
        dispatch(resetGraph())
        dispatch(setAllNodes(children));
        dispatch(setAllEdges(edges))
        window.requestAnimationFrame(() => {
          fitView && fitView({ padding: 0.25 });
        });
      });
    }, [nodesBeforeLayout]);

    return { setElkLayout };
  };

  const { setElkLayout } = useElkLayoutElements();
  const [forceDragPosition, setForceDragPosition] = useState<any>();

  const useForceLayoutElements = () => {

    const nodesInitialized = nodesBeforeLayout.every((node: any) => node.width && node.height)

    return useMemo(() => {
      const simulation = forceSimulation()
        .force('charge', forceManyBody().strength(-4000))
        .force('x', forceX().x(0).strength(0.05))
        .force('y', forceY().y(0).strength(0.05))
        .alphaTarget(0.01)
        .stop();

      // console.log('insideForce allLayoutNodes', allLayoutNodes)
      let forceNodes = nodesBeforeLayout.map((node: any) => ({ ...node, x: node.position.x, y: node.position.y }));
      let forceEdges = edgesBeforeLayout.map((edge: any) => ({ ...edge }));

      // if no width or height or no nodes in the flow, can't run the simulation!
      if (!nodesInitialized || forceNodes.length === 0) return [false, { toggleForceLayout: (setForce?: boolean) => null } as any];
      let running = false;
      simulation.nodes(forceNodes).force(
        'link',
        forceLink(forceEdges)
          .id((d: any) => d.id)
          .strength(0.05)
          .distance(42)
      );

      // The tick function is called every animation frame while the simulation is
      // running and progresses the simulation one step forward each time.
      const tick = () => {
        forceNodes.forEach((node: any, i: number) => {
          const activeNode = document.querySelector(`[data-id="${node.id}"].dragging`)
          const dragging = Boolean(activeNode);
          forceNodes[i].fx = dragging ? node.x : null;
          forceNodes[i].fy = dragging ? node.y : null;
        });

        simulation.tick();
        dispatch(setAllNodes(forceNodes.map((node: any) => ({ ...node, position: { x: node.x, y: node.y } }))) as any);

        window.requestAnimationFrame(() => {
          if (running) {
            tick()
            fitView && fitView({ padding: 0.25 });

          };
        });
      };

      const toggleForceLayout = (setForce?: boolean) => {
        if (typeof setForce === 'boolean') {
          running = setForce
        } else {
          running = !running
        }
        running && window.requestAnimationFrame(tick);

      };

      return [true, { toggleForceLayout, isForceRunning: running }];
    }, [nodesBeforeLayout]);
  }

  const [forceInitialized, { toggleForceLayout, isForceRunning }] = useForceLayoutElements();

  // Prevents layout bugs from occurring on navigate away and returning to a graph
  // https://reactrouter.com/en/main/hooks/use-blocker
  useBlocker(useCallback(
    (tx: any) => tx.historyAction && toggleForceLayout(false),
    [toggleForceLayout]
  ));



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
            <EntityOptions
              positionMode={positionMode}
              toggleForceLayout={toggleForceLayout}
              isForceActive={isForceRunning}
              activeGraph={activeGraph}
              allManualNodes={nodesBeforeLayout}
              allManualEdges={edgesBeforeLayout}
              setElkLayout={setElkLayout}
            />
            <div className='h-full w-full justify-between bg-mirage-600/95'>
              <div style={{ width: '100%', height: '100vh' }} ref={graphRef}>
                <Graph
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
                  fitView={fitView}
                  positionMode={positionMode}
                />
              </div>
            </div>
          </div>
          <CommandPallet
            isOpen={showCommandPalette}
            setOpen={setShowCommandPalette}
          />
          <div

            className='absolute top-[3.5rem] w-52 bg-red -z-10 h-20  text-slate-900'
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
