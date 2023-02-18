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
      <div className=' flex flex-col w-full max-w-sm justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-info-300 text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>
              {' '}
              <span className='text-[0.5rem] text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display font-bold'>Google Search</p>
          </div>
          <GoogleIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>Query</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1 w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <MagnifyingGlassIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                  <input
                    data-type='query'
                    type='text'
                    onChange={(event: any) => setQueryValue(event.target.value)}
                    value={queryValue}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-full bg-light-200 focus:bg-light-50'
                    placeholder='Search...'
                  />
                </div>
              </div>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display mt-1'>
                Total pages
              </p>
              <div className='flex items-center mb-1'>
                <div className='mt-1 w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <DocumentIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                  <input
                    data-type='pages'
                    type='number'
                    onChange={(event: any) => setPagesValue(event.target.value)}
                    value={pagesValue}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-full bg-light-200 focus:bg-light-50'
                    placeholder='HTTP 403'
                  />
                </div>
              </div>
              {/* <button
                type='submit'
                className='flex w-full mt-2 py-2 ml-auto items-center bg-info-200 rounded-full justify-between px-3'
              >
                <p className=' text-xs font-semibold font-display flex text-white whitespace-nowrap'>Search Google</p>
              </button> */}
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
                  toast.success("Fetching results")
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
