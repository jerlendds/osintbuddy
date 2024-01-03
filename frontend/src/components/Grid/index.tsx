import React, { ReactNode, useState } from "react";
import ReactGridLayout, { Responsive, ResponsiveProps, WidthProvider, } from "react-grid-layout";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/20/solid";
import { Icon } from "../Icons";



interface GridPanelProps {
  ref?: any
  key?: string;
  dataGrid?: JSONObject;
  label?: string;
  icon?: TablerIcon
  setIsLocked: any
  isLocked: any
}

export function GridPanel({
  ref,
  children,
  key,
  label,
  icon,
  setIsLocked,
  isLocked
}: React.PropsWithChildren<GridPanelProps>) {
  return (
    <>
      <div
        className="min-h-[3rem] overflow-hidden rounded flex flex-col w-full h-full border border-mirage-400/60  from-mirage-300/30 bg-gradient-to-tr from-40% to-mirage-100/20 shadow "
      >
        <ol className="text-sm flex select-none justify-between relative px-2 py-2">
          <li className="flex items-start">
            <div className="flex items-center">
              <h3 className="text-slate-300 flex items-center font-display truncate">
                {icon && <Icon className="h-5 w-5 mr-1 text-slate-400" icon={icon} />}
                {label ?? <><span className="font-medium font-display">/&nbsp;</span></>}
              </h3>
            </div>
          </li>
        </ol>
        {children}
      </div>
    </>

  );
}

