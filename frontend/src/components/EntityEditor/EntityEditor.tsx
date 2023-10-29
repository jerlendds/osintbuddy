import { tokyoNightInit } from "@uiw/codemirror-theme-tokyo-night";
import CodeMirror, { Extension } from "@uiw/react-codemirror";
import { tags as t } from "@lezer/highlight";
import { python } from "@codemirror/lang-python";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useEffectOnce } from "../utils";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectActiveEntity, setActiveEntityId } from "@/features/dashboard/dashboardSlice";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/24/outline";
import { Responsive, WidthProvider } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import { Icon } from "../Icons";
import { sdk } from "@/app/api";

export const tokyoNightTheme = tokyoNightInit({
  settings: {
    caret: "#c6c6c6",
    background: '#1a1b26',
    fontFamily: 'monospace'
  },
  styles: [{ tag: t.comment, color: "#6272a4" }],
})

export function CodeEditor({ code, setCode, lsp }: JSONObject) {
  return (
    <>{lsp ? (
      <CodeMirror
        theme={tokyoNightTheme}
        value={code}
        onChange={(value) => setCode(value)}
        extensions={[python(), lsp]}
      />
    ) : (
      <CodeMirror
        theme={tokyoNightTheme}
        value={code}
        onChange={(value) => setCode(value)}
        extensions={[python()]}
      />
    )}
    </>
  )
}


const ResponsiveGridLayout = WidthProvider(Responsive);


export default function EntityEditor({ activeEntity }: JSONObject) {
  const dispatch = useAppDispatch()

  const [isEntityDraggable, setEntityDraggable] = useState(false);
  const [code, setCode] = useState(activeEntity?.source)

  useEffect(() => {
    if (activeEntity?.source) setCode(activeEntity.source)
  }, [activeEntity?.source])

  return (
    <>
      <ResponsiveGridLayout
        compactType={null}
        className="w-auto flex h-full z-[99] absolute"
        rowHeight={56}
        maxRows={50}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 20, md: 20, sm: 20, xs: 18, xxs: 16 }}
        isDraggable={isEntityDraggable}
        isResizable={true}
      >
        <div
          className=" overflow-hidden rounded-md z-10 bg-dark-600 border border-dark-300  flex flex-col h-full"
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
                  Entity Editor
                  <span className="font-medium font-display">/&nbsp;</span>
                </span>
              </div>
            </li>
            <li className="flex mr-auto">
              <div className="flex justify-between items-center w-full text-slate-400 ">
                <span
                  className="text-slate-500 text-inherit whitespace-nowrap font-display"
                  title={"placeholder"}
                >
                  {activeEntity && activeEntity.label}
                  <span className="font-medium font-display ">&nbsp;/</span>
                </span>
              </div>
            </li>
            <li className="flex">
              <div className="flex justify-between items-center w-full text-slate-400 ">
                <button
                  onClick={() => {
                    // sdk.entities.updateEntityByUuid(activeEntity.uuid, {
                    //   source: pythonCode,
                    //   label: activeEntity.label,
                    //   description: activeEntity.description,
                    //   author: activeEntity.author
                    // }).then(() => {
                    //   toast.info(
                    //     `The ${activeEntity.label} entity has been saved.`
                    //   );
                    // }).catch(error => console.error(error));
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
          <div className="container bg-[#1A1B26] overflow-y-scroll h-full ">
            <div className="editor ">
              <CodeEditor code={code} setCode={setCode} />
            </div>
          </div>
        </div>
      </ResponsiveGridLayout >
    </>
  );
}