import { GoogleIcon, GripIcon, WebsiteIcon } from '@/components/Icons';
import api from '@/services/api.service';
import { AtSymbolIcon, LockOpenIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeContextProps } from '.';
import { handleStyle } from './styles';

export function EmailNode({ flowData }: any) {
  const [emailValue, setEmailValue] = useState<string>(flowData.data.email);
  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' style={handleStyle} />
      <Handle position={Position.Top} id='t1' key='t1' type='source' style={handleStyle} />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' style={handleStyle} />
      <Handle position={Position.Left} id='l1' key='l1' type='target' style={handleStyle} />
      <div className='node container'>
        <div className='highlight from-alert-600/0 via-alert-600 to-alert-600/0' />
        <div className='header bg-alert-600 bg-opacity-60'>
          <GripIcon className='h-5 w-5' />
          <div className='text-container'>
            <p>
              {' '}
              <span>ID: </span>
              {flowData.id}
            </p>
            <p>Email</p>
          </div>
          <WebsiteIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>URL</p>
              <div className='flex items-center mb-1'>
                <div className='node-field'>
                  <MagnifyingGlassIcon />
                  <input type='text' data-node='domain' value={emailValue} placeholder='example@gmail.com' />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export function EmailNodeContext({
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
            const nodeId = `${getId()}`;
            let bounds = node.getBoundingClientRect();
            api.get(`/extract/email/smtp-test?email=${nodeData[0].value}`).then((resp) => {
              addNode(
                nodeId,
                'smtp',
                {
                  x: bounds.x + 110,
                  y: bounds.y + 110,
                },
                {
                  data: resp.data,
                }
              );
              addEdge(parentId, nodeId);
            });
          }}
        >
          <AtSymbolIcon />
          To SMTP Test
        </button>
      </div>
      <div>
        <button
          onClick={(event) => {
            const nodeId = `${getId()}`;
            api.get(`/extract/google/search?query=${nodeData[0].value}&pages=${3}`).then((resp) => {
              let rect = node.getBoundingClientRect();
              let idx = 0;
              idx += 1;
              if (resp.data) {
                let newNode: any = null;
                // @ts-ignore
                resp.data.forEach((result, rIdx) => {
                  const nodeId = `${getId()}`;
                  addNode(
                    nodeId,
                    'result',
                    {
                      x: rIdx % 2 === 0 ? rect.x + 420 : rect.x + 1200,
                      y:
                        rIdx % 2 === 0
                          ? rIdx * 80 - rect.y + Math.ceil(result.description.length / 70) * 50
                          : (rIdx - 1) * 80 - rect.y + Math.ceil(result.description.length / 70) * 50,
                    },
                    {
                      ...result,
                    }
                  );
                  addEdge(parentId, nodeId);
                });
              }
            });
          }}
        >
          <GoogleIcon />
          To Google
        </button>
      </div>
    </div>
  );
}
