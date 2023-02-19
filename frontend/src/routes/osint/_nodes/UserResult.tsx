import { GripIcon } from '@/components/Icons';
import { PaperClipIcon, UserIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { Handle, Position } from 'reactflow';


export function UserResultNode({ flowData }: { flowData: any }) {
  return (
    <>
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='target' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='target' />
      <div className='min-w-[500px] bg-light-200 max-w-2xl flex'>
        <div className='bg-pink-300 px-0 py-2 flex-shrink-0 flex flex-col items-center justify-center w-10 text-white text-sm font-medium rounded-l-sm'>
          <UserIcon className='w-5 h-5' />
          <div className='flex-1 justify-center -mt-5 flex flex-col'>
            <GripIcon className='h-5 w-5' />
          </div>
        </div>
        <ul
          role='list'
          className='w-full grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 py-1 rounded-b-sm shadow-sm'
        >
          <li className='col-span-full flex  w-full'>
            <div className='flex-1 flex flex-col whitespace-wrap px-4 pb-2 text-sm'>
              <p data-type='title' className='text-lg break-words'>
                {flowData.data && flowData.data.category && flowData.data.category}
              </p>
              <p data-type='description' className='text-sm  whitespace-wrap max-w-xl break-words'>
                {flowData.data && flowData.data.site && flowData.data.site}
              </p>
              <div
                onClick={() => {
                  console.log(flowData)
                  navigator.clipboard.writeText(flowData.data.link);
                  toast.success('The URL has been copied to your clipboard');
                }}
                className='flex items-center'
              >
                <p data-type='link' className='text-sm break-words text-info-200 max-w-xl whitespace-wrap'>
                  {flowData.data && flowData.data.link && flowData.data.link}
                </p>
                <PaperClipIcon className='w-5 h-5 text-info-200 mx-1' />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}
