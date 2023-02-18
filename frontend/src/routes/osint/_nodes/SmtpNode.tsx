import { GoogleIcon, GripIcon, WebsiteIcon } from '@/components/Icons';
import api from '@/services/api.service';
import { AtSymbolIcon, LockOpenIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeContextProps } from '.';

export function SmtpNode({ flowData }: any) {
  const [results, setResults] = useState<Array<string>>(flowData.data.data);
  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className=' flex flex-col w-72 max-w-2xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-alert-700 text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>
              {' '}
              <span className='text-[0.5rem] text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display font-bold'>SMTP Test</p>
          </div>
          <WebsiteIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'></p>
              {results.map((line) => {
                return (
                  <div className='flex items-center'>
                      <p
                        data-type='domain'
                        className='placeholder:text-gray-50 rounded-2xl text-xs  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                        placeholder=''
                      >{line}</p>
                  </div>
                );
              })}
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
