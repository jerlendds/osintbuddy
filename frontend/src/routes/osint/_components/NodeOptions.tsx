import { Menu, Disclosure, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, PlusIcon, Square2StackIcon } from '@heroicons/react/24/outline';
import React, { useRef, useState, MutableRefObject, useEffect, useCallback } from 'react';
import { Fragment } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { JSONObject } from '@/globals';
import { GripIcon } from '@/components/Icons';

type UseResizeProps = {
  minWidth: number;
};

type UseResizeReturn = {
  width: number;
  enableResize: () => void;
};

export const useResize = ({ minWidth }: UseResizeProps): UseResizeReturn => {
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState(minWidth);

  const enableResize = useCallback(() => {
    setIsResizing(true);
  }, [setIsResizing]);

  const disableResize = useCallback(() => {
    setIsResizing(false);
  }, [setIsResizing]);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = e.clientX; // You may want to add some offset here from props
        if (newWidth >= minWidth) {
          setWidth(newWidth);
        }
      }
    },
    [minWidth, isResizing, setWidth]
  );

  useEffect(() => {
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', disableResize);

    return () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', disableResize);
    };
  }, [disableResize, resize]);

  return { width, enableResize };
};

const statuses: JSONObject = {
  'Installed': 'text-green-700 bg-green-50 ring-green-600/20',
  'Enabled': 'text-gray-600 bg-gray-50 ring-gray-500/10',
  'Not Installed': 'text-yellow-800 bg-yellow-50 ring-yellow-600/20',
};

export function ListItem({ entity, onDragStart }: JSONObject) {
  return (
    <>
      <li key={entity.id} className='flex items-center px-6 w-full justify-between py-3'>
        <div
          draggable
          onDragStart={(event) => onDragStart(event, entity.name)}
          className='flex min-w-[12rem] p-2 justify-between overflow-x-hidden bg-dark-400 hover:bg-dark-600 border-transparent border h-[86px] border-l-info-100 hover:border-info-100 transition-colors duration-150 border-l-[6px] hover:border-l-[6px] rounded-md w-full'
        >
          <div className='flex flex-col w-full'>
            <div className='flex items-start justify-between gap-x-3 w-full relative'>
              <p className='text-sm font-semibold leading-6 text-slate-300 whitespace-nowrap'>{entity.name}</p>
              <p
                className={classNames(
                  statuses[entity.status as string],
                  'rounded-[0.25rem] right-0 relative whitespace-nowrap text-slate-300 px-1.5 py-0.5 text-xs font-medium ring-1 ring-info-100 ring-inset'
                )}
              >
                {entity.status}Installed
              </p>
            </div>
            <div className='mt-1 flex flex-wrap items-center gap-x-2 text-xs leading-5 text-slate-500'>
              <p className='truncate  leading-5 text-slate-500 text-sm'>
                {' '}
                {entity.description ? entity.description : 'No Description'}
              </p>

              <svg viewBox='0 0 2 2' className='h-0.5 w-0.5 fill-current'>
                <circle cx={1} cy={1} r={1} />
              </svg>
              <p className='truncate  leading-5 text-slate-500 text-xs'>
                Created by {entity.createdBy ? entity.createdBy : 'the OSINTBuddy team'}
              </p>
            </div>
          </div>
        </div>
      </li>
    </>
  );
}

let isResizing: any = null;

export default function NodeOptions({ options }: any) {
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <>
      <div
        style={{  resize: 'horizontal' }}
        className='overflow-hidden border-dark-300 z-10 border bg-dark-600  h-full py-2 top-11 -right-px'
      >
        <div className='text-xl items-center justify-between w-full flex px-6 '>
          <span className='font-display text-slate-400 font-semibold'>Entities</span>
          <Square2StackIcon className='w-8 h-8 text-slate-400' />
        </div>

        <ul className='overflow-y-scroll h-full pb-24 relative'>
          {options.map((option: JSONObject) => (
            <ListItem onDragStart={onDragStart} key={option.name} entity={option} />
          ))}
        </ul>
        {/* <button
          type='button'
          // onMouseDown={enableResize}
          // onMouseUp={disableResize}
          className='bottom-12  absolute z-50 rotate-90 origin-center -left-2 bg-dark-500 rounded-full border-x border-t border-info-200/20 cursor-sw-resize'
        >
          <ChevronUpDownIcon className='h-5 w-5 m-1.5 text-slate-400 bg-red z-50' />
        </button> */}
      </div>
    </>
  );
}
