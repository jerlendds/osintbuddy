// @ts-nocheck
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import "react-grid-layout/css/styles.css";
import { Responsive, WidthProvider } from "react-grid-layout";
import CodeMirror from "@uiw/react-codemirror";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { tokyoNightInit } from "@uiw/codemirror-theme-tokyo-night";
import { tags as t } from "@lezer/highlight";
import { python } from "@codemirror/lang-python";
import { Icon } from "@/components/Icons";
import { useParams } from "react-router-dom"
import { useEffectOnce } from "@/components/utils";
import { sdk } from "@/app/api";

const ResponsiveGridLayout = WidthProvider(Responsive);

export function ResizableHandles({ activeEntity }: JSONObject) {
  const [pythonCode, setPythonCode] = useState(activeEntity.source);
  const [isEntityDraggable, setEntityDraggable] = useState(false);
  const [isElementsDraggable, setElementsDraggable] = useState(false);

  useEffect(() => {
    setPythonCode(activeEntity.source)
  }, [activeEntity])
  return (
    <>
      <ResponsiveGridLayout
        compactType={null}
        className="w-auto flex h-full z-[99] absolute"
        rowHeight={60}
        maxRows={50}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 20, md: 20, sm: 20, xs: 18, xxs: 16 }}
        isDraggable={isEntityDraggable}
        isResizable={true}
      >
        <div
          className=" overflow-hidden rounded-md z-10 border border-dark-300  flex flex-col h-full"
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
          <ol className="text-sm flex select-none  relative px-2 py-2">
            <li className="flex items-start">
              <div className="flex items-center">
                <span className="text-slate-500 font-display truncate">
                  Entity Editor{" "}
                  <span className="font-medium font-display">/&nbsp;</span>
                </span>
              </div>
            </li>
            <li className="flex mr-auto">
              <div className="flex justify-between items-center w-full text-slate-400 ">
                <span
                  className="text-slate-500 text-inherit whitespace-nowrap font-display"
                  title={"placeholder"}
                  aria-current={"placeholder"}
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
                    sdk.entities.updateEntityByUuid(activeEntity.uuid, {
                      source: pythonCode,
                      label: activeEntity.label,
                      description: activeEntity.description,
                      author: activeEntity.author
                    }).then(() => {
                      toast.info(
                        `The ${activeEntity.label} entity has been saved.`
                      );
                    }).catch(error => console.error(error));
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
          <div className="container overflow-y-scroll h-full !bg-[#1a1b26]">
            <div className="editor ">
              <CodeMirror

                theme={tokyoNightInit({
                  settings: {
                    caret: "#c6c6c6",
                    fontFamily: "FiraCode",
                    background: '#1a1b26'
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
      </ResponsiveGridLayout >
    </>
  );
}


export default function EntityDetails() {
  const params: any = useParams()
  const [activeGraph, setActiveGraph] = useState<any>(null);
  const [graphStats, setGraphStats] = useState<any>(null);
  const [activeEntity, setActiveEntity] = useState({});

  useEffect(() => {
    if (params?.entityId) {
      sdk.entities.getEntity(params.entityId).then(data => {
        setActiveEntity(data)
      })
    }
  }, [params?.entityId])

  return (
    <>
      <section className="flex flex-col h-screen w-full">
        {/* <GraphHeader stats={graphStats} graph={activeGraph} /> */}
        <section className="flex w-full h-full relative">
          <ResizableHandles activeEntity={activeEntity} />
        </section>
      </section>
    </>
  )
}
