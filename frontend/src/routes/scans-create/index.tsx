// @ts-nocheck
import { useCallback, useState, useMemo, DragEventHandler } from "react";
import ReactFlow, {
  Edge,
  Background,
  Controls,
  BackgroundVariant,
  FitViewOptions,
  NodeDragHandler,
  Connection,
  useNodesState,
  useEdgesState,
} from "reactflow";
import {
  createEdge,
  fetchNodeBlueprint,
  onEdgesChange,
  updateEdgeEvent,
  updateNodeFlow,
} from "@src/features/graph/graphSlice";
import { useAppDispatch, useAppSelector } from "@src/app/hooks";
import { toast } from "react-toastify";
// @ts-nocheck
import { useRef } from "react";
import "reactflow/dist/style.css";
import { useComponentVisible, useEffectOnce } from "@src/app/hooks";
import { Responsive, WidthProvider } from "react-grid-layout";
import { GripIcon, Icon } from "@src/components/Icons";
import classNames from "classnames";

const viewOptions: FitViewOptions = {
  padding: 50,
};

export function WorkflowPanel({
  graphRef,
  nodes,
  edges,
  graphInstance,
  setGraphInstance,
  addEdge,
  setNodes,
  setEdges,
  sendJsonMessage,
  onPaneClick,
  onPaneCtxMenu,
  onSelectionCtxMenu,
  onMultiSelectionCtxMenu,
  activeProject,
  setIsEditingMini,
  onNodesChange,
  onEdgesChange,
}: JSONObject) {
  const dispatch = useAppDispatch();

  const onDragOver: DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop: DragEventHandler<HTMLDivElement> = useCallback(
    async (event) => {
      event.preventDefault();
      const label =
        event.dataTransfer &&
        event.dataTransfer.getData("application/reactflow");
      const data = JSON.parse(label);
      if (typeof label === "undefined" || !label) return;
      const graphBounds = graphRef.current.getBoundingClientRect();
      const position = graphInstance.project({
        x: event.clientX - graphBounds.left,
        y: event.clientY - graphBounds.top,
      });
      try {
        setNodes((nds: any) =>
          nds.concat({
            id: `${Math.floor(Math.random() * 10)}`,
            data,
            position,
            type: "base",
          })
        );
      } catch (error: unknown) {
        if (error instanceof Error) toast.info(error.message);
      }
    },
    [graphInstance, graphRef, setNodes]
  );
  const nodeTypes = useMemo(
    () => ({
      base: (data: JSONObject) => {
        return (
          <>
            <div className="bg-slate-900 text-slate-300 border border-dark-800  rounded-md">
              <section className="flex items-center">
                <GripIcon className="text-slate-400" />
                <div className="flex px-3">
                  <span className="bg-dark-400 p-2">
                    <Icon
                      icon={data.data.icon}
                      className="text-sky-400 w-10 h-10"
                    />
                  </span>
                  <section className="px-4 flex flex-col justify-center">
                    <p className="font-display font-medium">{data.data.name}</p>
                    <p className="font-display text-xs">
                      {data.data.description}
                    </p>
                  </section>
                </div>
              </section>
            </div>
          </>
        );
      },
    }),
    []
  );

  return (
    <ReactFlow
      minZoom={0.2}
      maxZoom={2.0}
      nodes={nodes}
      edges={edges}
      onDrop={onDrop}
      onConnect={(connection) => {
        dispatch(createEdge(connection));
      }}
      onEdgesChange={onEdgesChange}
      onDragOver={onDragOver}
      onInit={setGraphInstance}
      onNodesChange={onNodesChange}
      fitView
      fitViewOptions={viewOptions}
      nodeTypes={nodeTypes}
      panActivationKeyCode="Space"
      onPaneClick={onPaneClick}
      onPaneContextMenu={onPaneCtxMenu}
      onNodeContextMenu={onSelectionCtxMenu}
      onSelectionContextMenu={onMultiSelectionCtxMenu}
    >
      <Background
        variant={BackgroundVariant.Dots}
        className="bg-dark-[rgb(10 15 20)]"
        color="#1F3057"
      />
      <Controls />
    </ReactFlow>
  );
}
const ResponsiveGridLayout = WidthProvider(Responsive);

export function ResizableHandles({ activeEntity }: JSONObject) {
  const [showEntities, setShowEntities] = useState(true);
  const [searchFilter, setSearchFilter] = useState("");

  const dataGrid = {
    x: 0.1,
    y: 0,
    w: 5,
    h: 16,
    maxH: 16,
    minH: 1,
    maxW: 16,
    minW: 4.5,
  };

  const onDragStart = (event: DragEvent, nodeType: string) => {
    if (event?.dataTransfer) {
      event.dataTransfer.setData("application/reactflow", nodeType);
      event.dataTransfer.effectAllowed = "move";
    }
    event.stopPropagation();
  };

  const [isDraggable, setDraggable] = useState(false);

  const [activeTab, setActiveTab] = useState("actions");

  const actions = [
    {
      id: "invoke_task",
      icon: "cpu-2",
      name: "Invoke Task",
      description: "Invoke a custom python function",
    },
  ];

  return (
    <ResponsiveGridLayout
      compactType={null}
      className="h-full z-[99] absolute"
      rowHeight={38}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 26, md: 26, sm: 24, xs: 22, xxs: 18 }}
      isDraggable={isDraggable}
      isResizable={true}
    >
      <div
        className=" overflow-hidden rounded-md z-10 border border-dark-300 bg-dark-700 flex flex-col h-min"
        key="a"
        data-grid={dataGrid}
      >
        {showEntities && (
          <>
            <div className="text-sm items-center justify-around w-full flex mt-2 px-4">
              <button
                onClick={() => setActiveTab("actions")}
                className={classNames(
                  "font-display select-none",
                  activeTab === "actions" ? "text-sky-400" : "text-slate-600"
                )}
              >
                Actions
              </button>
              <button
                onClick={() => setActiveTab("flows")}
                className={classNames(
                  "font-display select-none",
                  activeTab === "flows" ? "text-sky-400" : "text-slate-600"
                )}
              >
                Flows
              </button>
            </div>
            <div className="mt-2.5 block justify-between items-center bg-dark-800 mx-4 rounded-md border-0 px-3.5 py-1 text-slate-100 shadow-sm ring-1 ring-light-900/10">
              <input
                onChange={(e) => setSearchFilter(e.target.value)}
                className="block w-full placeholder:text-slate-700 bg-dark-800 outline-none focus:ring-info-200 sm:text-sm"
                placeholder={`Search ${activeTab}...`}
              />
            </div>
            <ul className="overflow-y-scroll ml-4 pr-4 h-full relative">
              {activeTab === "actions" &&
                actions.map((entity: JSONObject) => {
                  return (
                    <li className="flex items-center w-full justify-between py-3">
                      <div
                        draggable
                        onDragStart={(event: any) =>
                          onDragStart(event, JSON.stringify(entity))
                        }
                        className="flex min-w-[12rem] p-2 justify-between overflow-x-hidden bg-dark-400/60 hover:bg-dark-600 border-transparent border max-h-[160px] border-l-info-300 hover:border-info-100 transition-colors duration-150 border-l-[6px] hover:border-l-[6px] rounded-md w-full"
                      >
                        <div className="flex flex-col w-full select-none">
                          <div className="flex items-start gap-x-1 w-full relative">
                            <span className="text-sky-500 float-left">
                              <Icon
                                className="text-sky-500 h-10 w-10 float-left"
                                icon={entity.icon}
                              />
                            </span>
                            <p className="text-lg mt-auto mb-2 font-semibold leading-6 text-slate-300 whitespace-nowrap">
                              {entity.name}
                            </p>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-x-2 text-xs leading-5 text-slate-500">
                            <p className="truncate whitespace-normal leading-5 text-slate-500">
                              {entity.description && entity.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
            </ul>
          </>
        )}
      </div>
    </ResponsiveGridLayout>
  );
}

export default function ScansCreatePage() {
  const graphRef = useRef<any>(null);
  const [graphInstance, setGraphInstance] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { ref, isOpen, setIsOpen } = useComponentVisible(false);
  const [activeEntity, setActiveEntity] = useState({});

  return (
    <>
      <div className="h-screen flex flex-col w-full">
        <ResizableHandles activeEntity={activeEntity} />
        <div className=" h-full justify-between bg-dark-900 relative">
          <div style={{ width: "100%", height: "100vh" }} ref={graphRef}>
            <WorkflowPanel
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              activeProject={activeEntity}
              graphRef={graphRef}
              setNodes={setNodes}
              setEdges={setEdges}
              graphInstance={graphInstance}
              setGraphInstance={setGraphInstance}
              setIsEditingMini={setIsOpen}
              nodes={nodes}
              edges={edges}
            />
          </div>
        </div>
      </div>
    </>
  );
}
