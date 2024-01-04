// @ts-nocheck
import { ChevronUpDownIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Combobox } from '@headlessui/react';
import classNames from 'classnames';
import { ChangeEvent, Dispatch, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Handle, HandleType, Position } from 'reactflow';
import { GripIcon, Icon } from '@src/components/Icons';
import { Dialog } from '@headlessui/react';
import { useAppDispatch, useAppSelector, useComponentVisible } from '@src/app/hooks';
import Color from 'color';
import { type ThunkDispatch } from 'redux-thunk';
import {
  setEditState,
  type Graph,
  EditState,
  saveUserEdits,
  selectNodeValue,
  enableEntityEdit,
} from '@src/features/graph/graphSlice';
import { toast } from 'react-toastify';

const handleStyle = { borderColor: '#39477899', background: '#12172720', width: 12, margin: -1, height: 12 };

type NodeElement = NodeInput & {
  nodeId: string;
  editState: EditState;
  dispatch: ThunkDispatch<{ settings: { showSidebar: boolean }; graph: Graph }, undefined, AnyAction> &
  Dispatch<AnyAction>;
};


export default function ViewEntityNode({ ctx }: JSONObject) {
  const node = ctx.data;
  const displayValue = useMemo(() => Array.isArray(node.elements[0]) ? node.elements[0][0]?.value : node.elements[0]?.value, [node.elements])

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' style={handleStyle} />
      <Handle position={Position.Top} id='t1' key='t1' type='source' style={handleStyle} />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' style={handleStyle} />
      <Handle position={Position.Left} id='l1' key='l1' type='source' style={handleStyle} />

      <Handle position={Position.Right} id='r2' key='r2' type='target' style={handleStyle} />
      <Handle position={Position.Top} id='t2' key='t2' type='target' style={handleStyle} />
      <Handle position={Position.Bottom} id='b2' key='b2' type='target' style={handleStyle} />
      <Handle position={Position.Left} id='l2' key='l2' type='target' style={handleStyle} />
      <div className='node container !rounded-full'>
        <div
          // 99 === 0.6 opacity
          style={{ backgroundColor: node?.color?.length === 7 ? `${node.color}99` : node?.color }}
          className='header !rounded-full !p-3'
        >
          <Icon icon={node.icon} className='!h-14 !w-14 text-slate-300/95 cursor-grab focus:cursor-grabbing' />
        </div>
        <h2 className={`absolute -left-28 -right-28 max-w-xl pointer-events-none text-center text-slate-500 text-lg top-full -bottom-10 h-auto`}>
          {displayValue?.length >= 90 ? `${displayValue.slice(0, 90)}...` : displayValue}
        </h2>
      </div>
    </>
  );
}
