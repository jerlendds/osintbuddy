import { GripIcon } from '@/components/Icons';
import { PaperClipIcon, UserIcon, WindowIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { Handle, Position } from 'reactflow';
import { NodeContextProps } from '.';

export function ProfileNode({ flowData }: { flowData: any }) {
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

export function ProfileNodeContext({
  node,
  reactFlowInstance,
  addNode,
  addEdge,
  nodeData,
  nodeType,
  parentId,
  getId,
}: NodeContextProps) {

  return (
    <div className='py-1'>
      <div>
        <button
          onClick={(event) => {
            const url = nodeData[2].innerText;
            // @ts-ignore
            if (url) window?.open(url, '_blank').focus();
          }}
          className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
        >
          <WindowIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          Open in new tab
        </button>
      </div>
    </div>
  );
}

