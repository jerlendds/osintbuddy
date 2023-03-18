import { useState } from 'react';
import { Position, Handle } from 'reactflow';
import { GripIcon, IpIcon, WebsiteIcon } from '@/components/Icons';
import { NodeContextProps } from '.';
import api from '@/services/api.service';
import { GlobeAltIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { handleStyle } from './styles';

export function IpNode({ flowData, deleteNode }: any) {
  const [ips, setIps] = useState(flowData.data.ip);
  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' style={handleStyle} />
      <Handle position={Position.Top} id='t1' key='t1' type='source' style={handleStyle} />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' style={handleStyle} />
      <Handle position={Position.Left} id='l1' key='l1' type='target' style={handleStyle} />
      <div className='node container'>
        <div className='highlight from-warning-500/0 via-warning-500 to-warning-500/0' />
        <div className='header bg-warning bg-opacity-60'>
          <GripIcon />
          <div className='text-container'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>
              {' '}
              <span className='text-[0.5rem] text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display font-bold'>IP Address</p>
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
                  <div className='node-field'>
                    <IpIcon />

                    <input
                      type='text'
                      data-type='domain'
                      onChange={(event: any) => setIps(event.target.value)}
                      value={ips}
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
            let rect = node.getBoundingClientRect();
            toast.info("Fetching A record");
            api.get(`/extract/ip/domain?ip=${nodeData[0].value}`).then((resp) => {
              if (resp.data.length != 0) {
                addNode(
                  nodeId,
                  'domain',
                  {
                    x: rect.x + 160,
                    y: rect.y + 40,
                  },
                  resp.data
                );
                addEdge(parentId, nodeId);
              } else {
                toast.error('Found no hostname records in the DNS');
              }
            });
          }}
        >
          <GlobeAltIcon />
          To Domain
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            let rect = node.getBoundingClientRect();
            api.get(`/extract/ip/subdomains?ip=${nodeData[0].value}`).then((resp) => {
              if (resp.data && !resp.data[0].includes("No DNS A")) {
                console.log(resp.data);
                resp.data.forEach((domain: string, idx: number) => {
                  const nodeId = `${getId()}`;
                  addNode(
                    nodeId,
                    'domain',
                    {
                      x: rect.x + 160 + (idx + 200),
                      y: rect.y + 40 + idx * 120,
                    },
                    {
                      domain,
                    }
                  );
                  addEdge(parentId, nodeId);
                });
              } else {
                toast.error('Found no hostname records in the DNS');
              }
            });
          }}
        >
          <WebsiteIcon />
          To Subdomains
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            const nodeId = `${getId()}`;
            let rect = node.getBoundingClientRect();
            api.get(`/extract/ip/locate?ip=${nodeData[0].value}`).then((resp) => {
              addNode(
                nodeId,
                'geo',
                {
                  x: rect.x + 160,
                  y: rect.y + 80,
                },
                { ...resp.data }
              );
              addEdge(parentId, nodeId);
            });
          }}
        >
          <IpIcon />
          To Geolocation
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            const nodeId = `${getId()}`;
            let rect = node.getBoundingClientRect();
            api.get(`/extract/ip/traceroute?ip=${nodeData[0].value}`).then((resp) => {
              addNode(
                nodeId,
                'traceroute',
                {
                  x: rect.x + 160,
                  y: rect.y + 80,
                },
                { ...resp.data }
              );
              addEdge(parentId, nodeId);
            });
          }}
        >
          <IpIcon />
          To Traceroute
        </button>
      </div>
      <div>
        <button
          onClick={() => {
            const nodeId = `${getId()}`;
            let bounds = node.getBoundingClientRect();
            const domain = nodeData[0].value;
            if (domain) {
              api.get(`/extract/domain/urls?domain=${domain}`).then((resp) => {
                addNode(
                  nodeId,
                  'urlscan',
                  {
                    x: bounds.x + 160,
                    y: bounds.y + 80,
                  },
                  { ...resp.data, domain }
                );
                addEdge(parentId, nodeId);
              });
            }
          }}
        >
          <PaperClipIcon />
          To URL scan
        </button>
      </div>
    </div>
  );
}
