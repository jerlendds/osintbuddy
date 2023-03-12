import { useState } from 'react';
import { GoogleIcon, GripIcon } from '@/components/Icons';
import { Handle, Position } from 'reactflow';
import api from '@/services/api.service';
import { DocumentIcon, ListBulletIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { NodeContextProps } from '.';
import { toast } from 'react-toastify';

export function GoogleNode({ flowData }: { flowData: any }) {
  const [queryValue, setQueryValue] = useState<string>('');
  const [pagesValue, setPagesValue] = useState<number>(3);

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />

      <div className=' flex flex-col w-full max-w-sm justify-between rounded-sm transition duration-150 ease-in-out bg-slate-800/80 ring-1 ring-white/10 backdrop-blur'>
        <div className='absolute -bottom-px left-11 right-20 h-px bg-gradient-to-r from-persian-400/0 via-persian-400 to-persian-400/0' />
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-info-300 bg-opacity-20 text-slate-100 py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-medium'>
            <p className='text-[0.4rem] text-slate-400  whitespace-wrap font-display'>
              {' '}
              <span className='text-[0.5rem] text-slate-400 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
            <p className='text-xs text-slate-400 max-w-xl whitespace-wrap font-display font-medium'>Google Search</p>
          </div>
          <GoogleIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              <p className='text-[0.5rem] font-medium text-slate-400  whitespace-wrap font-display'>Query</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1 w-full  flex py-0.5 relative border-opacity-60  text-slate-500 focus:border-opacity-100  text-xs border border-info-400 focus:border-info-300 active:border-info-300 bg-slate-700 focus:ring-info-50 sm:text-sm text-light-20'>
                  <MagnifyingGlassIcon className='h-4 w-4 pl-0.5 mt-0.5 absolute top-1 text-gray-50 z-50' />

                  <input
                    data-type='query'
                    type='text'
                    onChange={(event: any) => setQueryValue(event.target.value)}
                    value={queryValue}
                    className='placeholder:text-gray-50 text-slate-100 bg-slate-700 focus:outline-none pl-5 w-full '
                    placeholder='Search...'
                  />
                </div>
              </div>
              <p className='text-[0.5rem] font-medium text-slate-400  whitespace-wrap font-display mt-1'>
                Total pages
              </p>
              <div className='flex items-center mb-1'>
                <div className='mt-1 w-full  flex py-0.5 relative border-opacity-60  text-slate-500 focus:border-opacity-100  text-xs border border-info-400 focus:border-info-300 active:border-info-300 bg-slate-700 focus:ring-info-50 sm:text-sm text-light-20'>
                  <DocumentIcon className='h-4 w-4 pl-0.5 mt-0.5 absolute top-1 text-gray-50 z-50' />

                  <input
                    data-type='pages'
                    type='number'
                    onChange={(event: any) => setPagesValue(event.target.value)}
                    value={pagesValue}
                    className='placeholder:text-gray-50 text-slate-100 bg-slate-700 focus:outline-none pl-5 w-full'
                    placeholder='HTTP 403'
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export function GoogleNodeContext({
  node,
  reactFlowInstance,
  addNode,
  addEdge,
  nodeData,
  nodeType,
  parentId,
  getId,
}: NodeContextProps) {
  return (
    <div className='py-1'>
      <div>
        <button
          onClick={() => {
            const bounds = node.getBoundingClientRect();
            api
              .get(`/extract/google/search?query=${nodeData[0].value}&pages=${nodeData[1].value}`)
              .then((resp) => {
                if (resp.data && resp.status === 200) {
                  toast.success('Fetching results');
                  resp.data.forEach((result: any, rIdx: number) => {
                    const nodeId = getId();
                    addNode(
                      nodeId,
                      'result',
                      {
                        x: rIdx % 2 === 0 ? bounds.x + 60 : bounds.x + 800,
                        y: rIdx % 2 === 0 ? rIdx * 60 + bounds.y : (rIdx - 1) * 60 + bounds.y,
                      },
                      {
                        ...result,
                      }
                    );
                    addEdge(parentId, nodeId);
                  });
                } else {
                  toast.error(`No results found`);
                }
              })
              .catch((error) => {
                toast.error(`Error ${error.response.data.detail}`);
              });
          }}
          className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
        >
          <ListBulletIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          To results
        </button>
      </div>
    </div>
  );
}
