import { GoogleIcon, GripIcon, WebsiteIcon } from '@/components/Icons';
import api from '@/services/api.service';
import { LockOpenIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeContextProps } from '.';

export function EmailNode({ flowData }: any) {
  const [emailValue, setEmailValue] = useState<string>(flowData.data.email);

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className=' flex flex-col w-72 max-w-2xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-alert-600 text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-dark-300  whitespace-wrap font-display'>Email</p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display'>
              <span className='text-xs text-dark-300 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
          </div>
          <WebsiteIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>URL</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <MagnifyingGlassIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={emailValue}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='example@gmail.com'
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

export function EmailNodeContext({
  node,
  reactFlowInstance,
  getId,
  addNode,
  addEdge,
  nodeData,
  nodeType,
  parentId,
}: NodeContextProps) {
  console.log(typeof reactFlowInstance)
  return (
    <div className='py-1'>
      {/* @todo retry with better proxies */}
      {/* <div>
        <button
          onClick={(event) => {
            const nodeId = `rw${getId()}`;
            api.get(`/extract/email/breaches?email=${nodeData[0].value}`).then((resp) => {
              console.log(resp, resp.data);
            });
          }}
          className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
        >
          <LockOpenIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          To Breaches
        </button>
      </div> */}
      <div>
        <button
          onClick={(event) => {
            const nodeId = `rw${getId()}`;
            api.get(`/extract/google/search?query=${nodeData[0].value}&pages=${3}`).then((resp) => {
              console.log(resp);
              let rect = node.getBoundingClientRect();
              let idx = 0;
                idx += 1;
                if (resp.data) {
                  let newNode: any = null;
                  // @ts-ignore

                  resp.data.forEach((result, rIdx) => {
                    const nodeId = `r${getId()}`;
                    newNode = addNode(
                      nodeId,
                      'result',
                      reactFlowInstance.project({
                        x: rIdx % 2 === 0 ? rect.x + 420 : rect.x + 1200,
                        y:
                          rIdx % 2 === 0
                            ? rIdx * 80 - rect.y + Math.ceil(result.description.length / 70) * 50
                            : (rIdx - 1) * 80 - rect.y + Math.ceil(result.description.length / 70) * 50,
                      }),
                      {
                        ...result,
                      }
                    );
                    addEdge(parentId, nodeId);
                  });
                }
            });
          }}
          className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
        >
          <GoogleIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          To Google
        </button>
      </div>
    </div>
  );
}
