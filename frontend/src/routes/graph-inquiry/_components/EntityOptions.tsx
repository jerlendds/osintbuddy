import {
  LockClosedIcon,
  LockOpenIcon,
} from '@heroicons/react/24/outline';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import 'react-grid-layout/css/styles.css';
import RGL, { Responsive, WidthProvider } from 'react-grid-layout';
import { useGetEntitiesQuery } from '@/app/api';

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
      <li key={entity.id} className='flex items-center w-full justify-between py-3'>
        <div
          draggable
          onDragStart={(event) => onDragStart(event, entity.label)}
          className='flex min-w-[12rem] p-2 justify-between overflow-x-hidden bg-dark-400/60 hover:bg-dark-600 border-transparent border max-h-[160px] border-l-info-300 hover:border-info-100 transition-colors duration-150 border-l-[6px] hover:border-l-[6px] rounded-md w-full'
        >
          <div className='flex flex-col w-full select-none'>
            <div className='flex items-start justify-between gap-x-3 w-full relative'>
              <p className='text-sm font-semibold leading-6 text-slate-300 whitespace-nowrap'>{entity.label}</p>
              {/* TODO: Find something useful to put here... */}
              {/* <p
                className={classNames(
                  statuses[entity.status],
                  'rounded-[0.25rem] right-0 relative whitespace-nowrap text-slate-300 px-1.5 py-0.5 text-xs font-medium ring-1 ring-info-300 ring-inset'
                )}
              >
                {entity.status}Installed
              </p> */}
            </div>
            <div className='mt-1 flex flex-wrap items-center gap-x-2 text-xs leading-5 text-slate-500'>
              <p className='truncate whitespace-normal leading-5 text-slate-500'>
                {' '}
                {entity.description && entity.description.length > 78 ?
                  `${entity.description.slice(0, 78)}...` : entity.description}
              </p>
              <svg viewBox='0 0 2 2' className='h-0.5 w-0.5 fill-current'>
                <circle cx={1} cy={1} r={1} />
              </svg>
              <p className='truncate  leading-5 text-slate-500 text-xs'>
                Created by {entity.author ? entity.author : 'the OSINTBuddy team'}
              </p>
            </div>
          </div>
        </div>
      </li>
    </>
  );
}

const ResponsiveGridLayout = WidthProvider(Responsive);

export default function EntityOptions({ options, activeProject }: JSONObject) {


  const {
    data: entitiesData = { entities: [], count: 0 },
    isLoading,
    isSuccess,
    isError
  } = useGetEntitiesQuery({ skip: 0, limit: 50 })
  const [showEntities, setShowEntities] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  const entities = useMemo(() => searchFilter
    ? entitiesData?.entities.filter((entity: JSONObject) => entity.label.toLowerCase().includes(searchFilter.toLowerCase()))
    : entitiesData?.entities, [searchFilter, entitiesData])

  const dataGrid = {
    x: 0.1,
    y: 0,
    w: 5,
    h: 15,
    maxH: 16,
    minH: 1,
    maxW: 44,
    minW: 1,
  };

  const onDragStart = (event: DragEvent, nodeType: string) => {
    if (event?.dataTransfer) {
      event.dataTransfer.setData('application/reactflow', nodeType);
      event.dataTransfer.effectAllowed = 'move';
    }
    event.stopPropagation();
  };

  const [isDraggable, setDraggable] = useState(false);

  return (
    <ResponsiveGridLayout
      compactType={null}
      className='z-[99] absolute'
      rowHeight={42}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 26, md: 26, sm: 24, xs: 22, xxs: 18 }}
      isDraggable={isDraggable}
      isResizable={true}
    >
      <div
        draggable={false}
        className=' overflow-hidden rounded-md z-10 border border-dark-300 bg-dark-700 flex flex-col h-min'
        key='a'
        data-grid={dataGrid}
      >
        <ol className='text-sm flex select-none bg-dark-700 relative px-4 pt-2'>
          <li className='flex mr-auto'>
            <h5
              title={activeProject.name}
              className='flex whitespace-nowrap truncate justify-between items-center w-full text-slate-500 text-inherit font-display '>
              <Link title='View all graphs' to='/dashboard/graph' replace>
                Graphs /&nbsp;
              </Link>
              {activeProject.label.length > 22 ? `${activeProject.label.slice(0, 22)}...` : activeProject.label}
              &nbsp;/
            </h5>
          </li>
          <li className='flex'>
            <div className='flex justify-between items-center w-full text-slate-400 '>
              <button
                onClick={() => setDraggable(!isDraggable)}
                className='text-slate-500 hover:text-slate-400 text-inherit whitespace-nowrap font-display'
                title={activeProject.name}
                aria-current={activeProject.description}
              >
                {isDraggable ? <LockOpenIcon className='w-5 h-5' /> : <LockClosedIcon className='w-5 h-5' />}
              </button>
            </div>
          </li>
        </ol>
        {showEntities && (
          <>
            <div className='text-xl items-center justify-between w-full flex mt-2 px-4'>
              <span className='font-display text-slate-400 font-medium select-none'>Entities</span>
            </div>

            <div className='mt-2.5 block justify-between items-center bg-dark-800 mx-4 rounded-md border-0 px-3.5 py-1 text-slate-100 shadow-sm ring-1 ring-light-900/10'>
              <input
                onChange={(e) => setSearchFilter(e.target.value)}
                className='block w-full placeholder:text-slate-700 bg-dark-800 outline-none focus:ring-info-200 sm:text-sm'
                placeholder='Search entities...'
              />
            </div>
            <ul className='overflow-y-scroll ml-4 pr-4 h-full relative'>
              {entities.map((entity) => (
                <ListItem onDragStart={onDragStart} key={entity.id} entity={entity} />
              ))}
            </ul>
          </>
        )}
      </div>
    </ResponsiveGridLayout>
  );
}
