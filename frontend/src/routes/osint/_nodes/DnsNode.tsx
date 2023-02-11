import { useState } from 'react';
import { Position, Handle } from 'reactflow';
import { GripIcon, IpIcon } from '@/components/Icons';


export function DnsNode({ flowData }: any) {
  const [dnsData, setDnsData] = useState(flowData.data.label);
  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log('ips', dnsData);
  };

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className=' flex flex-col w-[30rem] max-w-2xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-primary-800 text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>DNS</p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display'>
              <span className='text-xs text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
          </div>
          <IpIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form onSubmit={(event) => handleSubmit(event)} className='flex items-start flex-col'>
              <>
                {dnsData.map((dns: any) => {
                  console.log(dns.value);
                  return (
                    <>
                      <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                        {dns.type}
                      </p>
                      {dns.value.map((dnsRecord: any) => {
                        return (
                          <div className='flex items-center mb-1'>
                            <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                              <IpIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                              <input
                                type='text'
                                data-type='domain'
                                onChange={(event: any) => setDnsData(event.target.value)}
                                value={dnsRecord}
                                className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-[28rem] bg-light-200 focus:bg-light-50'
                              />
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                })}
              </>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}