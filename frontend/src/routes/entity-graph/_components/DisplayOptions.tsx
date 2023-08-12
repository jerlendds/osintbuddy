import { Menu, Disclosure, Transition } from '@headlessui/react';
import {
  ChevronUpDownIcon,
  ListBulletIcon,
  MapIcon,
  PlusIcon,
  Square2StackIcon,
  Squares2X2Icon,
} from '@heroicons/react/24/outline';
import React, { useRef, useState, MutableRefObject, useEffect, useCallback, DragEventHandler } from 'react';
import { Fragment } from 'react';
import { EllipsisVerticalIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import { GripIcon } from '@/components/Icons';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectViewMode, setNodeType, setViewMode } from '@/features/graph/graphSlice';

export default function DisplayOptions({ }: any) {
  const onDragStart = (event: DragEvent, nodeType: string) => {
    if (event?.dataTransfer) {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    }
  };

  // expects `mini` or `list`
  // const [viewMode, setViewMode] = useState<string>('base');
  const viewMode = useAppSelector((state) => selectViewMode(state))

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setNodeType(viewMode))
  }, [viewMode])

  return (
    <>
      <div id="findme" className='flex pl-6 my-3 fixed right-0 z-50'>
        <div className='h-12 flex items-center flex-col bg-dark-700 mr-2'>
          <fieldset className='isolate inline-flex shadow-sm'>
            <button
              onClick={() => dispatch(setViewMode('base'))}
              type='button'
              className={classNames(
                'relative py-3 inline-flex items-center rounded-l-md outline-none hover:ring-2 px-3 text-slate-400 ring-1 focus:bg-dark-800 ring-inset hover:bg-dark-600 focus:z-10 ring-dark-300',
                viewMode === 'base' && 'bg-dark-900'
              )}
            >
              <span className='sr-only'>List view</span>
              <Square2StackIcon
                className={classNames('h-5 w-5', viewMode === 'base' && 'text-info-100')}
                aria-hidden='true'
              />
            </button>
            <button
              onClick={() => dispatch(setViewMode('mini'))}
              type='button'
              className={classNames(
                'relative py-3 inline-flex items-center rounded-r-md  outline-none hover:ring-2 px-3 text-slate-400 ring-1 focus:bg-dark-800 ring-inset hover:bg-dark-600 focus:z-10 ring-dark-300',
                viewMode === 'mini' && 'bg-dark-900'
              )}
            >
              <span className='sr-only'>List view</span>
              <Squares2X2Icon
                className={classNames('h-5 w-5', viewMode === 'mini' && 'text-info-100')}
                aria-hidden='true'
              />
            </button>
          </fieldset>
        </div>
      </div>
    </>
  );
}
