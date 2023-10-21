// @ts-nocheck
import React, { useState, useRef } from "react";
import { Edge, XYPosition, Node } from "reactflow";
import { HotKeys } from "react-hotkeys";
import { useLocation } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import "reactflow/dist/style.css";
import ContextMenu from "./_components/ContextMenu";
import { WS_URL, sdk } from "@/app/api";
import { toast } from "react-toastify";
import ProjectGraph from "./_components/ProjectGraph";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  ProjectViewModes,
  createEdge,
  createNode,
  graphEdges,
  graphNodes,
  selectEditId,
  selectNode,
  selectViewMode,
} from "@/features/graph/graphSlice";
import { useComponentVisible, useEffectOnce } from "@/components/utils";
import DisplayOptions from "./_components/DisplayOptions";
const keyMap = {
  TOGGLE_PALETTE: ["shift+p"],
};
import "react-grid-layout/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import CodeMirror from "@uiw/react-codemirror";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { tokyoNight, tokyoNightInit } from "@uiw/codemirror-theme-tokyo-night";
import { tags as t } from "@lezer/highlight";
import { python } from "@codemirror/lang-python";
import { Icon } from "@/components/Icons";
import CommandPallet from "./_components/CommandPallet";

const ResponsiveGridLayout = WidthProvider(Responsive);

export function ResizableHandles({ activeEntity }: JSONObject) {
  const [pythonCode, setPythonCode] = useState(activeEntity.source);
  const [isEntityDraggable, setEntityDraggable] = useState(false);
  const [isElementsDraggable, setElementsDraggable] = useState(false);
  return (
    <>
      <ResponsiveGridLayout
        compactType={null}
        className="w-full z-[99] absolute"
        rowHeight={12}
        maxRows={50}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 20, md: 20, sm: 20, xs: 18, xxs: 16 }}
        isDraggable={isEntityDraggable}
        isResizable={true}
      >
        <div
          className=" overflow-hidden rounded-md z-10 border border-dark-300 bg-dark-700 flex flex-col h-min"
          key="b"
          data-grid={{
            x: 0,
            y: 0,
            w: 15,
            h: 14,
            maxH: 20,
            minH: 1,
            maxW: 18,
            minW: 4.5,
          }}
        >
          <ol className="text-sm flex select-none bg-dark-700 relative px-2 py-2">
            <li className="flex items-start">
              <div className="flex items-center">
                <span className="text-slate-500 font-display truncate">
                  Entity Editor
                  <span className="font-medium font-display">/&nbsp;</span>
                </span>
              </div>
            </li>
            <li className="flex mr-auto">
              <div className="flex justify-between items-center w-full text-slate-400 ">
                <span
                  className="text-slate-500 text-inherit whitespace-nowrap font-display"
                  title="placeholder"
                  aria-current="placeholder"
                >
                  {activeEntity.label}
                  <span className="font-medium font-display ">&nbsp;/</span>
                </span>
              </div>
            </li>
            <li className="flex">
              <div className="flex justify-between items-center w-full text-slate-400 ">
                <button
                  onClick={() => {
                    sdk.entities.updateEntityByUuid(({
                      entityUuid: activeEntity.uuid,
                      source: pythonCode,
                      label: activeEntity.label,
                      description: activeEntity.description,
                      author: activeEntity.author
                    }))
                  }}
                >
                  <Icon
                    icon="device-floppy"
                    className="w-5 h-5 text-slate-500 hover:text-slate-400 -mb-0.5 mx-1"
                  />
                </button>
                <button
                  onClick={() => setEntityDraggable(!isEntityDraggable)}
                  className="text-slate-500 hover:text-slate-400 text-inherit whitespace-nowrap font-display"
                >
                  {isEntityDraggable ? (
                    <LockOpenIcon className="w-5 h-5" />
                  ) : (
                    <LockClosedIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </li>
          </ol>

          <div className="container overflow-y-scroll">
            <div className="editor">
              <CodeMirror
                theme={tokyoNightInit({
                  settings: {
                    caret: "#c6c6c6",
                    fontFamily: "FiraCode",
                  },
                  styles: [{ tag: t.comment, color: "#6272a4" }],
                })}
                value={pythonCode}
                onChange={(value) => setPythonCode(value)}
                extensions={[python({ jsx: true })]}
                options={{
                  mode: "python",
                  theme: "default",
                  lineNumbers: true,
                }}
              />
            </div>
          </div>
        </div>
      </ResponsiveGridLayout>
    </>
  );
}

export default function EntityGraph() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const passedEntity = location?.state?.activeProject;
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
  const entityUUID = passedEntity.uuid.replace("-", "");
  const [socketUrl, setSocketUrl] = useState(
    `ws://${WS_URL}/nodes/graph/${entityUUID}`
  );
  const [isLoading, setIsLoading] = useState(true);
  const viewMode = useAppSelector((state) => selectViewMode(state));

  const { lastMessage, lastJsonMessage, readyState, sendJsonMessage } =
    useWebSocket(socketUrl, {
      onOpen: () => null,
      shouldReconnect: () => true,
    });

  // useEffectOnce(() => {
  //   dispatch(resetGraph());
  //   sendJsonMessage({ action: 'read:node' });
  // });

  function addNode(
    id,
    data: AddNode,
    position,
    type: ProjectViewModes = viewMode
  ) {
    dispatch(createNode({ id, data, position, type }));
  }

  function addEdge(
    source,
    target,
    sourceHandle?: string = "r1",
    targetHandle?: string = "l2",
    type?: string = "default"
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
    sdk.nodes.refreshPlugins((data) => {
      const options =
        data?.plugins
          ?.filter((option: any) => option)
          .map((option: string) => {
            return {
              event: option.label,
              title: option.label,
              description: option.description,
              author: option.author,
            };
          }) || [];
      return options;
    }).then((options) => setNodeOptions(options))
      .catch((error: Error) => console.error(error));
  };

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
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
    sdk.nodes.getEntityTransforms(node.data.label)
      .then((data) => {
        setTransforms(data.transforms);
      })
      .catch((error) => {
        toast.warn(
          `We found no transforms while trying to load the plugin ${node.data.label}.`
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
  const { ref, isOpen, setIsOpen } = useComponentVisible(false);

  const activeNodeId = useAppSelector((state) => selectEditId(state));
  const activeNode = useAppSelector((state) => selectNode(state, activeNodeId));

  const [activeEntity, setActiveEntity] = useState({});
  useEffectOnce(() => {
    sdk.entities.getEntity(entityUUID)
      .then((data) => setActiveEntity(data))
      .catch((error) => toast.error(`Error: ${error}`));
  });

  return (
    <>
      <HotKeys keyMap={keyMap} handlers={handlers}>
        <div className="h-screen flex flex-col w-full">
          <ResizableHandles
            key={activeEntity.label}
            activeEntity={activeEntity}
          />
          <div className=" h-full justify-between bg-dark-900 relative">
            <DisplayOptions />
            <div style={{ width: "100%", height: "100vh" }} ref={graphRef}>
              <ProjectGraph
                activeProject={activeEntity}
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
                setIsEditingMini={setIsOpen}
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
          id="node-options-tour"
          className="absolute top-[3.5rem] w-48 bg-red -z-10 h-20 left-[0.7rem] text-slate-900"
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
