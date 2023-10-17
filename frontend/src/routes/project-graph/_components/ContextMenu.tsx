import { XYPosition } from 'reactflow';
import ContextAction from './ContextAction';
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useAppDispatch } from '@/app/hooks';
import { deleteNode } from '@/features/graph/graphSlice';
import { useState } from 'react';

export default function ContextMenu({
  closeMenu,
  showMenu,
  ctxPosition: position,
  ctxSelection,
  transforms,
  zoomIn,
  zoomOut,
  sendJsonMessage,
}: {
  transforms: JSONObject[];
  showMenu: boolean;
  ctxPosition: XYPosition;
  ctxSelection: JSONObject;
  zoomIn: Function;
  zoomOut: Function;
  closeMenu: Function;
  sendJsonMessage: Function;
}) {
  const dispatch = useAppDispatch();

  const ctxPosition = {
    top: position.y,
    left: position.x,
  };

  const [query, setQuery] = useState('');
  const filteredTransforms = query
    ? transforms?.filter((transform) => transform.label.toLowerCase().includes(query.toLowerCase()))
    : transforms;

  return (
    <>
      <div id='context-menu' className='z-[999] absolute' style={ctxPosition}>
        {showMenu && (
          <div className='relative z-50 inline-block text-left'>
            <div className='absolute  right-0 z-10 mt-2 w-56 origin-top-right divide-y border border-dark-300 divide-dark-300 rounded-md bg-dark-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='py-1'>
                <div>
                  <div
                    className={classNames(
                      false ? 'bg-dark-700 text-slate-400' : 'text-slate-400',
                      'group flex items-center py-2 text-sm font-display'
                    )}
                  >
                    <span className='pl-2 text-slate-400 font-semibold font-display mr-3'>ID: </span>
                    {ctxSelection?.id ? ctxSelection.id : 'No node selected'}
                    {ctxSelection?.label && (
                      <span className='inline-flex ml-auto items-center rounded-full whitespace-nowrap truncate bg-dark-700 px-1.5 py-0.5 text-sm font-medium text-blue-800 mr-1'>
                        {ctxSelection.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {transforms && (
                <>
                  <div className='pb-2  '>
                    <div>
                      <div className='sm:col-span-2'>
                        <label
                          htmlFor='message'
                          className='sr-only block font-semibold leading-6 mt-4 text-slate-200 pl-8'
                        >
                          Search through the installed transforms for the {ctxSelection?.label} plugin
                        </label>
                        <div className='mt-2 pl-3 flex justify-between items-center'>
                          <input
                            value={query}
                            onChange={(e) => setQuery(e.currentTarget.value)}
                            name='message'
                            id='message'
                            className='block w-full transition-colors ease-in-out duration-100  bg-dark-900  rounded-md  px-3.5 py-1 text-slate-100 shadow-sm  placeholder:text-gray-400  outline-none 200 sm:text-sm sm:leading-6 mr-3'
                            placeholder='Search transforms...'
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <ContextAction
                    closeMenu={closeMenu}
                    nodeCtx={ctxSelection}
                    sendJsonMessage={sendJsonMessage}
                    transforms={filteredTransforms}
                  />
                </>
              )}
              {ctxSelection?.data?.label && (
                <div className='node-context'>
                  <div>
                    <button
                      onClick={() => {
                        closeMenu();
                        sendJsonMessage({
                          action: 'delete:node',
                          node: { id: ctxSelection.id },
                        });
                        dispatch(deleteNode(ctxSelection.id));
                      }}
                      type='button'
                    >
                      <TrashIcon aria-hidden='true' />
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
