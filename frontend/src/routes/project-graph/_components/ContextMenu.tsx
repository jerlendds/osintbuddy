import { XYPosition } from 'reactflow';
import ContextAction from './ContextAction';
import { MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useAppDispatch } from '@/app/hooks';
import { deleteNode } from '@/features/graph/graphSlice';

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
  transforms: string[] | null;
  showMenu: boolean;
  ctxPosition: XYPosition;
  ctxSelection: JSONObject;
  zoomIn: Function;
  zoomOut: Function;
  closeMenu: Function;
  sendJsonMessage: Function;
}) {
  const dispatch = useAppDispatch()

  const ctxPosition = {
    top: position.y,
    left: position.x,
  };

  return (
    <>
      <div id='context-menu' className='z-[999] absolute' style={ctxPosition}>
        {showMenu && (
          <div className='relative z-50 inline-block text-left'>
            <div className='absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-dark-300 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
              <div className='py-1'>
                <div>
                  <div
                    className={classNames(
                      false ? 'bg-slate-500 text-slate-400' : 'text-slate-400',
                      'group flex items-center py-2 text-sm font-display'
                    )}
                  >
                    <span className='pl-2 text-slate-400 font-semibold font-display mr-3'>ID: </span>
                    {ctxSelection?.id ? ctxSelection.id : 'No node selected'}
                    {ctxSelection?.label && (
                      <span className='inline-flex ml-auto items-center rounded-full whitespace-nowrap truncate bg-dark-400 px-1.5 py-0.5 text-sm font-medium text-blue-800 mr-1'>
                        {ctxSelection.label}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {transforms && (
                <ContextAction
                  closeMenu={closeMenu}
                  nodeCtx={ctxSelection}
                  sendJsonMessage={sendJsonMessage}
                  transforms={transforms}
                />
              )}
              {ctxSelection?.data?.label ? (
                <div className='node-context'>
                  <div>
                    <button
                      onClick={() => {
                        closeMenu();
                        dispatch(deleteNode(ctxSelection?.id))
                      }}
                      type='button'
                    >
                      <TrashIcon aria-hidden='true' />
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <div className='node-context'>
                  <div>
                    <button onClick={() => zoomIn && zoomIn({ duration: 200 })} type='button'>
                      <MagnifyingGlassPlusIcon aria-hidden='true' />
                      Zoom in
                    </button>
                  </div>
                  <div>
                    <button onClick={() => zoomOut && zoomOut({ duration: 200 })} type='button'>
                      <MagnifyingGlassMinusIcon aria-hidden='true' />
                      Zoom out
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
