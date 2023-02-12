import { useState } from 'react';
import { Position, Handle } from 'reactflow';
import { GripIcon, IpIcon } from '@/components/Icons';
import { NodeContextProps } from '.';
import api from '@/services/api.service';
import { PaperClipIcon } from '@heroicons/react/24/outline';

export function IpNode({ flowData, deleteNode }: any) {
  const [ips, setIps] = useState(flowData.data.ip);
  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className=' flex flex-col w-72 max-w-2xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-warning text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>IP Address</p>
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
                <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                  IP Address
                </p>
                <div className='flex items-center mb-1'>
                  <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                    <IpIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                    <input
                      type='text'
                      data-type='domain'
                      onChange={(event: any) => setIps(event.target.value)}
                      value={ips}
                      className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    />
                  </div>
                </div>
              </>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function IpNodeContext({
  node,
  reactFlowInstance,
  getId,
  addNode,
  addEdge,
  nodeData,
  nodeType,
  parentId,
}: NodeContextProps) {
  return (
    <div className='py-1'>
      <div>
        <button
          onClick={(event) => {
            const nodeId = `rw${getId()}`;
            let rect = node.getBoundingClientRect();
            api.get(`/extract/ip/domain?ip=${nodeData[0].value}`).then((resp) => {
              addNode(
                nodeId,
                'domain',
                reactFlowInstance.project({
                  x: rect.x + 160,
                  y: rect.y + 40,
                }),
                resp.data
              );
              addEdge(parentId, nodeId);
            });
          }}
          className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
        >
          <IpIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          To Domain
        </button>
      </div>
      <div>
        <button
          onClick={(event) => {
            const nodeId = `rw${getId()}`;
            let rect = node.getBoundingClientRect();
            api.get(`/extract/ip/locate?ip=${nodeData[0].value}`).then((resp) => {
              addNode(
                nodeId,
                'geo',
                reactFlowInstance.project({
                  x: rect.x + 160,
                  y: rect.y + 80,
                }),
                { ...resp.data }
              );
              addEdge(parentId, nodeId);
            });
          }}
          className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
        >
          <IpIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          To Geolocation
        </button>
      </div>
      <div>
        <button
          onClick={(event) => {
            const nodeId = `rw${getId()}`;
            let rect = node.getBoundingClientRect();
            api.get(`/extract/ip/traceroute?ip=${nodeData[0].value}`).then((resp) => {
              addNode(
                nodeId,
                'traceroute',
                reactFlowInstance.project({
                  x: rect.x + 160,
                  y: rect.y + 80,
                }),
                { ...resp.data }
              );
              addEdge(parentId, nodeId);
            });
          }}
          className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
        >
          <IpIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          To Traceroute
        </button>
      </div>
      <div>
        <button
          onClick={(event) => {
            const nodeId = `us${getId()}`;
            let bounds = node.getBoundingClientRect();
            const domain = nodeData[0].value;
            console.log(new URL(domain).host);
            if (domain) {
              api.get(`/extract/domain/urls?domain=${new URL(domain).host}`).then((resp) => {
                addNode(
                  nodeId,
                  'urlscan',
                  reactFlowInstance.project({
                    x: bounds.x + 160,
                    y: bounds.y + 80,
                  }),
                  { ...resp.data, domain }
                );
                addEdge(parentId, nodeId);
              });
            }
          }}
          className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
        >
          <PaperClipIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          To URL scan
        </button>
      </div>
    </div>
  );
}
