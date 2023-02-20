import { useState } from 'react';
import { Position, Handle } from 'reactflow';
import { GripIcon, WebsiteIcon } from '@/components/Icons';

export function WhoisNode({ flowData }: any) {
  const [seoData, setSeoData] = useState(flowData.data.label);
  const handleSubmit = (event: any) => {
    event.preventDefault();
  };
  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />

      <div className=' flex flex-col  h-64 w-[32rem] max-w-9xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-start justify-between rounded-t-sm bg-pink-600 text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>
              {' '}
              <span className='text-[0.5rem] text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display font-bold'>WHOIS</p>
          </div>
          <WebsiteIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex  w-full p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <div className='flex overflow-y-scroll h-52 flex-col mb-1 w-full'>
              {seoData.length !== 0 &&
                seoData.map((whois: string) => {
                  const entry = whois.split(/:(.*)/s)
                  return (
                    <div className='flex items-start w-full my-0.5'>
                       <p
                        className='text-xs font-display font-semibold flex items-center break-inside-avoid whitespace-nowrap'
                        placeholder='https://www.google.com'
                      >
                        {entry[0]}:
                      </p>
                      <p
                        className=' text-xs font-display flex items-center whitespace-wrap pl-2 break-words'
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
