import { GoogleIcon, GripIcon, WebsiteIcon } from '@/components/Icons';
import api from '@/services/api.service';
import { AtSymbolIcon, LockOpenIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeContextProps } from '.';
import { handleStyle } from './styles';

export function SmtpNode({ flowData }: any) {
  const [results, setResults] = useState<Array<string>>(flowData.data.data);
  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' style={handleStyle} />
      <Handle position={Position.Top} id='t1' key='t1' type='source' style={handleStyle} />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' style={handleStyle} />
      <Handle position={Position.Left} id='l1' key='l1' type='target' style={handleStyle} />
      <div className='node container'>
        <div className='highlight from-alert-700/0 via-alert-700 to-alert-700/0' />
        <div className='header bg-alert-700 bg-opacity-60'>
          <GripIcon className='h-5 w-5' />
          <div className='text-container'>
            <p className='id'>
              {' '}
              <span className='id'>ID: </span>
              {flowData.id}
            </p>
            <p className='label'>SMTP Test</p>
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
                        className='text-xs pl-4 w-64 focus:bg-light-50 break-words text-slate-400'
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
