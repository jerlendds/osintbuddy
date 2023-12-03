// @ts-nocheck
import { ChevronUpDownIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Combobox } from '@headlessui/react';
import classNames from 'classnames';
import { ChangeEvent, Dispatch, Fragment, useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { GripIcon, Icon } from '@/components/Icons';
import { Dialog } from '@headlessui/react';
import { useAppDispatch, useAppSelector, useComponentVisible } from '@/app/hooks';
import Color from 'color';
import { type ThunkDispatch } from 'redux-thunk';
import {
  setEditState,
  type Graph,
  EditState,
  saveUserEdits,
  selectNodeValue,
  toggleEntityEdit,
} from '@/features/graph/graphSlice';
import { toast } from 'react-toastify';

var dropdownKey = 0;

const getKey = () => {
  dropdownKey += 1;
  return `k_${dropdownKey}`;
};

var nodeKey = 0;

const getNodeKey = () => {
  nodeKey += 1;
  return `k_${nodeKey}`;
};

const handleStyle = { borderColor: '#39477899', background: '#12172720', width: 12, margin: -1, height: 12 };

type NodeElement = NodeInput & {
  nodeId: string;
  editState: EditState;
  dispatch: ThunkDispatch<{ settings: { showSidebar: boolean }; graph: Graph }, undefined, AnyAction> &
  Dispatch<AnyAction>;
};


export default function BaseMiniNode({
  ctx,
  dispatch
}: JSONObject) {
  const node = ctx.data;
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
      <div
        onDoubleClick={() => {
          dispatch(toggleEntityEdit(ctx.id))
        }}
        data-label-type={node.label}
        className='node container !rounded-full'
      >
        <div
          // 99 === 0.6 opacity
          style={{ backgroundColor: node?.color?.length === 7 ? `${node.color}99` : node?.color }}
          className='header !rounded-full !p-4'
        >
          <Icon icon={node.icon} className='!h-20 !w-20  cursor-grab focus:cursor-grabbing' />
        </div>
      </div>
    </>
  );
}
