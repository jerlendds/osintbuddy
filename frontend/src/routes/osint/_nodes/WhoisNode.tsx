import { useState } from 'react';
import { Position, Handle } from 'reactflow';
import { GripIcon, WebsiteIcon } from '@/components/Icons';
import { handleStyle } from './styles';

export function WhoisNode({ flowData }: any) {
  const [seoData, setSeoData] = useState(flowData.data.label);
  const handleSubmit = (event: any) => {
    event.preventDefault();
  };
  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' style={handleStyle} />
      <Handle position={Position.Top} id='t1' key='t1' type='source' style={handleStyle} />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' style={handleStyle} />
      <Handle position={Position.Left} id='l1' key='l1' type='target' style={handleStyle} />

      <div className='node container'>
        <div className='highlight from-pink-600/0 via-pink-600 to-pink-600/0' />
        <div className='header bg-pink-600 bg-opacity-60'>
          <GripIcon className='h-5 w-5' />
          <div className='text-container'>
            <p>
              <span>ID: </span>
              {flowData.id}
            </p>
            <p>WHOIS</p>
          </div>
          <WebsiteIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex  w-full p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <div className='flex overflow-y-scroll h-52 flex-col mb-1 w-full'>
              {seoData.length !== 0 &&
                seoData.map((whois: string) => {
                  const entry = whois.split(/:(.*)/s);
                  return (
                    <div className='flex text-slate-400 items-start w-full my-0.5'>
                      <p
                        className='text-xs font-display font-medium  text-slate-500 flex items-center break-inside-avoid '
                        placeholder='https://www.google.com'
                      >
                        {entry[0]}:
                      </p>
                      <p
                        className='text-xs font-display flex items-center pl-2 break-words'
                        placeholder='https://www.google.com'
                      >
                        {entry[1]}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
