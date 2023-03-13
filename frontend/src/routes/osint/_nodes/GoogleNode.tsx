import { useState } from 'react';
import { GoogleIcon, GripIcon } from '@/components/Icons';
import { Handle, Position } from 'reactflow';
import api from '@/services/api.service';
import { DocumentIcon, ListBulletIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { NodeContextProps } from '.';
import { toast } from 'react-toastify';
import { handleStyle } from './styles';

export function GoogleNode({ flowData }: { flowData: any }) {
  const [queryValue, setQueryValue] = useState<string>('');
  const [pagesValue, setPagesValue] = useState<number>(3);

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' style={handleStyle} />
      <Handle position={Position.Top} id='t1' key='t1' type='source' style={handleStyle} />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' style={handleStyle} />
      <Handle position={Position.Left} id='l1' key='l1' type='target' style={handleStyle} />
      <div className='node container'>
        <div className='highlight from-persian-400/0 via-persian-400 to-persian-400/0' />
        <div className='header bg-info-300 bg-opacity-40'>
          <GripIcon />
          <div className='text-container'>
            <p className='id'>
              <span className='id'>ID: </span>
              {flowData.id}
            </p>
            <p className='label'>Google Search</p>
          </div>
          <GoogleIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              <p className='node-label'>Query</p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <MagnifyingGlassIcon />
                  <input
                    data-type='query'
                    type='text'
                    onChange={(event: any) => setQueryValue(event.target.value)}
                    value={queryValue}
                    placeholder='Search...'
                  />
                </div>
              </div>
              <p className='node-label'>Total pages</p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <DocumentIcon />
                  <input
                    data-type='pages'
                    type='number'
                    onChange={(event: any) => setPagesValue(event.target.value)}
                    value={pagesValue}
                    className=''
                    placeholder='HTTP 403'
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export function GoogleNodeContext({
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
            const bounds = node.getBoundingClientRect();
            api
              .get(`/extract/google/search?query=${nodeData[0].value}&pages=${nodeData[1].value}`)
              .then((resp) => {
                if (resp.data && resp.status === 200) {
                  toast.success('Fetching results');
                  resp.data.forEach((result: any, rIdx: number) => {
                    const nodeId = getId();
                    addNode(
                      nodeId,
                      'result',
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
              })
              .catch((error) => {
                toast.error(`Error ${error.response.data.detail}`);
              });
          }}
        >
          <ListBulletIcon aria-hidden='true' />
          To results
        </button>
      </div>
    </div>
  );
}
