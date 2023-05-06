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
      <div className='node container min-w-[22rem]'>
        <div className='header bg-persian-300 bg-opacity-60'>
          <GripIcon className='h-5 w-5' />
          <div className='text-container'>
            <p>
              <span>ID: </span>
              {flowData.id}
            </p>
            <p>Subdomains</p>
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
                    <div className='node-field'>
                      <WebsiteIcon />
                      <input type='text' data-node='domain' value={subdomain} />
                    </div>
                  </div>
                ))}
              <input
                type='text'
                className='hidden'
                onChange={() => null}
                value={flowData.data && flowData.data.id}
                data-node='origin'
              />
              <input
                type='text'
                onChange={() => null}
                className='hidden'
                value={flowData.data && flowData.data.status}
                data-node='href'
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
