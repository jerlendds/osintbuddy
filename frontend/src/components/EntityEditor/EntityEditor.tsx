import { auraInit } from "@uiw/codemirror-theme-aura";
import CodeMirror, { Extension } from "@uiw/react-codemirror";
import { tags as t } from "@lezer/highlight";
import { python } from "@codemirror/lang-python";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { Icon } from "../Icons";
import { useUpdateEntityByIdMutation, Entity } from '@app/api';
import { UpdateEntityByIdApiArg } from '../../app/api';
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

export const tokyoNightTheme = auraInit({
  settings: {
    caret: "#c6c6c6",
    background: 'rgba(0 0 0 0)',
    fontFamily: 'monospace',
    gutterBackground: 'rgba(36, 46, 77, .16)',
    selectionMatch: 'rgba(76, 86, 107, .00)',
    lineHighlight: 'rgba(36, 46, 77, .26)',
  },
  styles: [{ tag: t.comment, color: "#6272a4" }],
})

export function CodeEditor({ code, setCode }: JSONObject) {
  return (
    <CodeMirror
      theme={tokyoNightTheme}
      value={code}
      onChange={(value) => setCode(value)}
      extensions={[python()]}
    />
  )
}


const ResponsiveGridLayout = WidthProvider(Responsive);

interface EntityEditorProps {
  activeEntity?: Entity
  refetchEntity: () => void
}

export default function EntityEditor({ activeEntity, refetchEntity }: EntityEditorProps) {
  const [isEntityDraggable, setEntityDraggable] = useState(false);
  const [code, setCode] = useState(activeEntity?.source)
  useEffect(() => {
    if (activeEntity?.source) setCode(activeEntity.source)
  }, [activeEntity?.source])
  const [updateEntityById] = useUpdateEntityByIdMutation()


  return (
    <>
      <ResponsiveGridLayout
        compactType={null}
        className="w-full flex h-full z-[99] absolute"
        rowHeight={56}
        maxRows={50}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 20, md: 20, sm: 20, xs: 18, xxs: 16 }}
        isDraggable={isEntityDraggable}
        isResizable={true}
      >
        <div
          className="overflow-hidden rounded-md border-mirage-100/0 shadow-lg border z-10 from-mirage-100/10 to-mirage-200/10  bg-gradient-to-tl from-50% flex flex-col h-full"
          key="b"
          data-grid={{
            x: 0,
            y: 0,
            w: 15.5,
            h: 14,
            maxH: 20,
            minH: 1,
            maxW: 18,
            minW: 4.5,
          }}
        >
          <ol className="text-sm flex select-none from-mirage-400/30 bg-gradient-to-tr from-40% to-mirage-300/10 relative px-2 py-2 border-b border-mirage-300/80">
            <li className="flex items-start">
              <div className="flex items-center">
                <span className="text-slate-500 font-display truncate">
                  Entity Editor
                  <span className="font-medium font-display">/&nbsp;</span>

                </span>
              </div>
            </li>
            <li className="flex mr-auto">
              <div className="flex justify-between items-center w-full text-slate-400">
                <span
                  className="text-inherit whitespace-nowrap font-display"
                  title={"placeholder"}
                >
                  {activeEntity?.label && activeEntity.label}
                  <span className="font-medium font-display text-slate-500">&nbsp;/</span>
                </span>
              </div>
            </li>
            <li className="flex">
              <div className="flex justify-between items-center w-full text-slate-400 ">
                <button
                  onClick={() => {
                    updateEntityById({ hid: activeEntity?.id ?? "", entityBase: { source: code } }).then(() => toast.info(
                      `The ${activeEntity?.label} entity has been saved.`
                    ))
                    refetchEntity()
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
          <div className="container bg-t overflow-y-scroll h-full ">
            <div className="editor ">
              <CodeEditor code={code} setCode={setCode} />
            </div>
          </div>
        </div>
      </ResponsiveGridLayout >
    </>
  );
}
