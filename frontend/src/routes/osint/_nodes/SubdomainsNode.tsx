import { useState, useEffect } from 'react';
import { Position, Handle } from 'reactflow';
import { IntervalBasedCronScheduler, parseCronExpression } from 'cron-schedule';
import { GripIcon, WebsiteIcon } from '@/components/Icons';
import RoundLoader from '@/components/Loaders';
import api from '@/services/api.service';

export function SubdomainNode({ flowData }: any) {
  const task = flowData?.data?.id;
  const [subdomains, setSubdomains] = useState<Array<string>>([]);
  const [status, setStatus] = useState<string>(flowData.data.status);

  useEffect(() => {
    const scheduler = new IntervalBasedCronScheduler(60 * 1000);
    api.get(`/extract/domain/subdomains/status?id=${task}`).then((resp) => {
      if (resp.data.status !== 'PENDING') {
        setStatus('DONE');
      }
      setSubdomains(resp.data.task.subdomains);
    });
    if (status === 'PENDING') {
      scheduler.registerTask(parseCronExpression('*/30 * * * *'), async () => {
        await api.get(`/extract/domain/subdomains/status?id=${task}`).then((resp) => {
          if (resp.data.status !== 'PENDING') {
            setStatus('DONE');
            scheduler.stop();
          }
          setSubdomains(resp.data.task.subdomains);
        });
      });
    }
  }, []);

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className=' flex flex-col w-72 max-w-2xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-persian-300 text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>
              {' '}
              <span className='text-[0.5rem] text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display font-bold'>Subdomains</p>
          </div>
          <WebsiteIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              {status !== 'PENDING' ? (
                <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                  Subdomains
                </p>
              ) : (
                <div className='flex items-center justify-center w-full'>
                  <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                    Loading
                  </p>
                  <RoundLoader className='ml-2' />
                </div>
              )}
              {subdomains &&
                subdomains.map((subdomain) => (
                  <div className='flex items-center mb-1'>
                    <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                      <WebsiteIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                      <input
                        type='text'
                        data-type='domain'
                        value={subdomain}
                        className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                      />
                    </div>
                  </div>
                ))}
              <input
                type='text'
                className='hidden'
                onChange={() => null}
                value={flowData.data && flowData.data.id}
                data-type='origin'
              />
              <input
                type='text'
                onChange={() => null}
                className='hidden'
                value={flowData.data && flowData.data.status}
                data-type='href'
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
