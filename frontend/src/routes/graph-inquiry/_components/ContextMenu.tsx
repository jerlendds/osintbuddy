import { XYPosition } from 'reactflow';
import ContextAction from './ContextAction';
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useAppDispatch } from '@src/app/hooks';
import { deleteNode, setEditState } from '@src/features/graph/graphSlice';
import { useState } from 'react';
import { useGetEntityTransformsQuery } from '@src/app/api';

export default function ContextMenu({
  closeMenu,
  showMenu,
  ctxPosition: position,
  ctxSelection,
  sendJsonMessage,
  activeTransformLabel
}: JSONObject) {
  const dispatch = useAppDispatch();

  const ctxPosition = {
    top: position.y,
    left: position.x,
  };

  const { data: transformsData = { transforms: [], type: null }, isLoading: isLoadingTransforms, isError: isTransformsError, isSuccess: isTransformsSuccess } = useGetEntityTransformsQuery({ label: activeTransformLabel as string }, { skip: activeTransformLabel === null })


  const [query, setQuery] = useState('');
  const filteredTransforms = query
    ? transformsData?.transforms.filter((transform: any) => transform.label.toLowerCase().includes(query.toLowerCase()))
    : transformsData?.transforms ?? [];
  return (
    <>
      <div id='context-menu' className='z-[999] absolute' style={ctxPosition}>
        {showMenu && (
          <div className='relative z-50 inline-block text-left'>
            <div className='absolute  right-0 z-10 mt-2 w-56 origin-top-right divide-y border border-mirage-400/70 divide-mirage-400/70 rounded-md to-mirage-700/95 from-mirage-600/95 bg-gradient-to-br shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='py-1'>
                <div>
                  <div
                    className='text-slate-400 group flex items-center py-2 text-sm font-display'
                  >
                    <span className='pl-2 text-slate-600 font-semibold font-display mr-3'>ID: </span>
                    {ctxSelection?.id ? ctxSelection.id : 'No node selected'}

                  </div>
                </div>
              </div>
              {transformsData && transformsData?.transforms && (
                <>
                  {ctxSelection && (
                    <div className=' '>
                      <div>
                        <div className='sm:col-span-2'>
                          <label
                            htmlFor='message'
                            className='sr-only block font-semibold leading-6 mt-4 text-slate-200 pl-8'
                          >
                            Search through the installed transforms for the {ctxSelection?.label} plugin
                          </label>
                          <div className='mt-2.5 hover:border-mirage-200/40 transition-colors duration-200 ease-in-out block justify-between items-center to-mirage-400/50 from-mirage-300/20 bg-gradient-to-br rounded border mb-2 mx-4 focus-within:!border-primary/40  px-3.5 py-1 text-slate-100 shadow-sm border-mirage-400/20 ring-light-900/10 focus-within:from-mirage-400/20 focus-within:to-mirage-400/30 focus-within:bg-gradient-to-l'>
                            <input
                              value={query}
                              onChange={(e) => setQuery(e.currentTarget.value)}
                              name='message'
                              id='message'
                              className='block w-full placeholder:text-slate-700 bg-transparent outline-none  sm:text-sm'
                              placeholder='Search transforms...'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

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
                        // dispatch(setEditState({ editId: ctxSelection.id, editLabel: 'deleteNode' }))
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
