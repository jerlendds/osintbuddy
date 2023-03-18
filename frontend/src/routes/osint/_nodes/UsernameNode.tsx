import { GoogleIcon, GripIcon } from '@/components/Icons';
import api from '@/services/api.service';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { MagnifyingGlassIcon, UserGroupIcon, ListBulletIcon } from '@heroicons/react/24/outline';
import { NodeContextProps } from '.';
import { toast } from 'react-toastify';

export function UsernameNode({ flowData }: any) {
  const [usernameValue, setUsernameValue] = useState<string>(flowData.data.username);
  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className='node container'>
        <div className='header bg-pink bg-opacity-60'>
          <GripIcon className='h-5 w-5' />
          <div className='text-container'>
            <p>
              {' '}
              <span>ID: </span>
              {flowData.id}
            </p>
            <p>Username</p>
          </div>
          <UserGroupIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>Username</p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <MagnifyingGlassIcon />
                  <input type='text' data-type='query' value={usernameValue} placeholder='Mark Zuckerberg' />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export function UsernameNodeContext({
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
    <div className='node-context'>
      <div>
        <button
          onClick={() => {
            let bounds = node.getBoundingClientRect();
            toast.info('Fetching profiles');
            api.get(`extract/username/accounts?username=${nodeData[0].value}`).then((resp: any) => {
              if (resp.data && resp.status === 200) {
                toast.success('Fetching results');
                resp.data.forEach((result: any, rIdx: number) => {
                  const nodeId = getId();
                  addNode(
                    nodeId,
                    'profile',
                    {
                      x: rIdx % 2 === 0 ? bounds.x + 60 : bounds.x + 800,
                      y: rIdx % 2 === 0 ? rIdx * 60 + bounds.y : (rIdx - 1) * 60 + bounds.y,
                    },
                    {
                      ...result,
                    }
                  );
                  addEdge(parentId, nodeId);
                });
              } else {
                toast.error(`No results found`);
              }
            });
          }}
        >
          <ListBulletIcon />
          To profiles
        </button>
      </div>
    </div>
  );
}
