import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { XYPosition, Node, ReactFlowInstance, FitView, Edge } from 'reactflow';
import { HotKeys } from 'react-hotkeys';
import { useParams, useLocation, useBlocker } from 'react-router-dom';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { SendJsonMessage } from 'react-use-websocket/dist/lib/types';
import { forceSimulation, forceLink, forceManyBody, forceX, forceY } from 'd3-force';
import 'reactflow/dist/style.css';
import EntityOptions from './_components/EntityOptions';
import ContextMenu from './_components/ContextMenu';
import { toast } from 'react-toastify';
import Graph from './_components/Graph';
import ELK from 'elkjs/lib/elk.bundled.js';
import { useAppDispatch, useAppSelector, useEffectOnce } from '@src/app/hooks';
import {
  ProjectViewModes,
  createEdge,
  createNode,
  graphEdges,
  graphNodes,
  resetGraph,
  selectEditState,
  selectPositionMode,
  selectViewMode,
  setAllEdges,
  setAllNodes,
  setEditState,
  setPositionMode,
} from '@src/features/graph/graphSlice';
import { WS_URL } from '@src/app/baseApi';
import CommandPallet from './_components/CommandPallet';
import { useGetGraphQuery } from '@src/app/api';
import RoundLoader from '@src/components/Loaders';
import { useTour } from '@reactour/tour';

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
  edgeId = edgeId + 1
  return `e-tmp-${edgeId}`
}

const loadingToastId = "loadingToast";

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
  const displayMode = useAppSelector((state) => selectViewMode(state));
  const [shouldConnect, setShouldConnect] = useState(false)


  const { lastJsonMessage, readyState, sendJsonMessage }: UseWebsocket = useWebSocket(socketUrl, {
    shouldReconnect: () => shouldConnect,
    onClose: () => {
      dispatch(resetGraph())
      toast.update(
        loadingToastId,
        {
          render: `The connection was lost! ${shouldConnect ? 'Attempting to reconnect...' : ''}`,
          type: 'warning',
          isLoading: false,
          autoClose: 1400
        }
      )
    }
  });

  useEffectOnce(() => {
    toast.loading('Loading graph...', { closeButton: true, isLoading: true, toastId: loadingToastId })
    dispatch(resetGraph());

  });
  const socketStatus = {
    [ReadyState.CONNECTING]: 'connecting',
    [ReadyState.OPEN]: 'open',
    [ReadyState.CLOSING]: 'closing',
    [ReadyState.CLOSED]: 'closed',
    [ReadyState.UNINSTANTIATED]: 'uninstantiated',
  }[readyState];

  useEffect(() => {
    if (activeGraph && !socketUrl.includes(activeGraph?.id)) {
      dispatch(resetGraph());
      setSocketUrl(`${WS_GRAPH_INQUIRE}/${activeGraph.id}`)
      setShouldConnect(true)
    }
  }, [activeGraph?.id, socketStatus[readyState]])

  const togglePalette = () => setShowCommandPalette(!showCommandPalette);

  const handlers = {
    TOGGLE_PALETTE: togglePalette,
  };

  const createEntityAction = ({ data, id, position, parentId }: JSONObject) => {
    dispatch(createNode({ id, data, position, type: 'edit' }));
    dispatch(
      createEdge({
        source: parentId,
        target: id,
        sourceHandle: 'r1',
        targetHandle: 'l2',
        type: 'float',
        id: getEdgeId()
      })
    );
  };

  // Handle any actions the websocket sends from backend
  const wsActionPlayer: any = {
    'isInitialRead': () => {
      dispatch(setAllNodes(lastJsonMessage.nodes))
      dispatch(setAllEdges(lastJsonMessage.edges))
    },
    'read': () => {
      dispatch(setAllNodes(lastJsonMessage.nodes))
      dispatch(setAllEdges(lastJsonMessage.edges))
    },
    'createEntity': () => {
      const createResults = lastJsonMessage?.results ?? []
      createResults.forEach((node: any, idx: number) => {
        // TODO: Move position layout logic to backend...
        const isOdd = idx % 2 === 0;
        const pos = node.position;
        const x = isOdd ? pos.x + 560 : pos.x + 970;
        const y = isOdd ? pos.y - (idx - 4) * 120 : pos.y - (idx - 3.5) * 120;
        node.position = {
          x,
          y,
        };
        createEntityAction(node);
        dispatch(setEditState({ editId: node.id, editLabel: 'addNode' }))
        sendJsonMessage({ action: 'update:node', node: { id: node.id, x, y } });
      })
    },
    'removeEntity': () => {

    },
    'isLoading': () => {
      if (lastJsonMessage.detail) toast.loading('Loading...', { closeButton: true, isLoading: true, toastId: loadingToastId })
      else toast.update(loadingToastId, { render: `${lastJsonMessage?.message ? lastJsonMessage.message : "Success!"}`, type: "success", isLoading: false, autoClose: 1600 })
    },
    'error': () => toast.error(`${lastJsonMessage.message}`)
  }

  useEffect(() => {
    const wsAction = lastJsonMessage?.action
    if (wsAction) wsActionPlayer[wsAction]()
    lastJsonMessage && messageHistory.length > 50 ?
      setMessageHistory([lastJsonMessage]) :
      setMessageHistory((prev) => prev.concat(lastJsonMessage))
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
  // just delete/save position on drag/etc?
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


  let fitView: FitView | any;
  if (graphInstance) {
    fitView = graphInstance.fitView
  }

  const changeState = useAppSelector(state => selectEditState(state))


  useEffect(() => {
    if (positionMode === 'manual') {
      setNodesBeforeLayout(initialNodes)
      setEdgesBeforeLayout(initialEdges)
    }
  }, [initialNodes, initialEdges]) // , activeEditState

  useEffect(() => {
    if (positionMode === 'manual') {
      dispatch(setAllNodes(nodesBeforeLayout))
      dispatch(setAllEdges(edgesBeforeLayout))
    }
  }, [positionMode])

  // TODO: Also implement d3-hierarchy, entitree-flex, dagre, webcola, and graphology layout modes
  //       Once implemented measure performance and deprecate whatever performs worse
  // tree layouts toggle found in top right
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
        children: structuredClone(nodesBeforeLayout),
        edges: structuredClone(edgesBeforeLayout),
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
    }, [nodesBeforeLayout, changeState]);

    return { setElkLayout };
  };

  const { setElkLayout } = useElkLayoutElements();

  // force layout hook/toggle found in top right
  const useForceLayoutElements = () => {
    const nodesInitialized = initialNodes.every((node: any) => node.width && node.height)

    return useMemo(() => {
      const simulation = forceSimulation()
        .force('charge', forceManyBody().strength(-4000))
        .force('x', forceX().x(0).strength(0.05))
        .force('y', forceY().y(0).strength(0.05))
        .alphaTarget(0.01)
        .stop();

      let forceNodes = initialNodes.map((node: any) => ({ ...node, x: node.position.x, y: node.position.y }));
      let forceEdges = structuredClone(initialEdges);

      const forceSimOff = [false, { toggleForceLayout: (setForce?: boolean) => null } as any]
      // if no width or height or no nodes in the flow, can't run the simulation!
      if (!nodesInitialized || forceNodes.length === 0) return forceSimOff;
      let running = false;
      try {
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
          simulation.tick();
          dispatch(setAllNodes(forceNodes.map((node: any) => ({ ...node, position: { x: node.x, y: node.y } }))));
          window.requestAnimationFrame(() => {
            if (running) {
              tick()
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
      } catch (e) { console.warn(e) }
      return forceSimOff
    }, [nodesBeforeLayout, changeState]);
  }

  const [forceInitialized, { toggleForceLayout, isForceRunning }] = useForceLayoutElements();

  // If not on a manual layout, update the manual layout positions 
  // for any drag changes, entity edit mode toggles, and transforms/deletions
  // this is for when a user updates/deletes an entity in a layout mode thats not manual
  useEffect(() => {
    if (changeState.editLabel === 'deleteNode') {
      setEdgesBeforeLayout(edgesBeforeLayout.filter((edge: Edge) => edge.target !== changeState.editId || edge.source !== changeState.editId))
      setNodesBeforeLayout(nodesBeforeLayout.filter((node: Node) => node.id !== changeState.editId))
    }
    if (changeState.editLabel === 'createEntity') {
      setNodesBeforeLayout([...nodesBeforeLayout, initialNodes.find((node: Node) => node.id === changeState.editId) as Node])
    }
    if (changeState.editLabel === "enableEditMode") {
      setNodesBeforeLayout([...nodesBeforeLayout.map((node: Node) =>
        node.id === changeState.editId ? { ...node, type: 'edit' } : node
      )])
    }
    if (changeState.editLabel === "disableEditMode") {
      setNodesBeforeLayout([...nodesBeforeLayout.map((node: Node) =>
        node.id === changeState.editId ? { ...node, type: 'view' } : node
      )])
    }
    if (changeState.editLabel?.includes('layout')) {
      fitView && fitView({ includeHiddenNodes: true })
    }
  }, [changeState])

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
              activeGraph={activeGraph}
              setElkLayout={setElkLayout}
            />
            <div className='h-full w-full justify-between  bg-mirage-500/50'>
              <div style={{ width: '100%', height: '100vh' }} ref={graphRef}>
                <Graph
                  onSelectionCtxMenu={onSelectionCtxMenu}
                  onMultiSelectionCtxMenu={onMultiSelectionCtxMenu}
                  onPaneCtxMenu={onPaneCtxMenu}
                  onPaneClick={onPaneClick}
                  graphRef={graphRef}
                  nodes={initialNodes}
                  edges={initialEdges}
                  graphInstance={graphInstance}
                  setGraphInstance={setGraphInstance}
                  sendJsonMessage={sendJsonMessage}
                  fitView={fitView}
                  positionMode={positionMode}
                  editState={changeState}
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
