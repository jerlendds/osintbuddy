import { useState } from 'react';
import { Position, Handle } from 'reactflow';
import { GripIcon, IpIcon } from '@/components/Icons';

export function DnsNode({ flowData }: any) {
  const [dnsData, setDnsData] = useState(flowData.data.label);
  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className='node container min-w-[30rem]'>
        <div className='header bg-primary-800 bg-opacity-60'>
          <GripIcon className='h-5 w-5' />
          <div className='text-container'>
            <p>
              <span>ID: </span>
              {flowData.id}
            </p>
            <p>DNS</p>
          </div>
          <IpIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form onSubmit={(event) => handleSubmit(event)} className='flex items-start flex-col'>
              <>
                {dnsData.map((dns: any) => {
                  return (
                    <>
                      <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                        {dns.type}
                      </p>
                      {dns.value.map((dnsRecord: any) => {
                        return (
                          <div className='flex items-center mb-1'>
                            <div className='node-field'>
                              <IpIcon />
                              <input
                                type='text'
                                data-type='domain'
                                onChange={(event: any) => setDnsData(event.target.value)}
                                value={dnsRecord}
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
