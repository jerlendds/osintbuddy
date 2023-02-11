import { GripIcon, WebsiteIcon, IpIcon } from '@/components/Icons';
import api from '@/services/api.service';
import { CogIcon, DocumentMagnifyingGlassIcon, MagnifyingGlassIcon, WindowIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeContextProps } from '.';

export function DomainNode({ flowData }: any) {
  const [domainValue, setDomainValue] = useState<string>(flowData.data?.label.domain);

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className=' flex flex-col w-72 max-w-2xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-persian text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>Domain</p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display'>
              <span className='text-xs text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
          </div>
          <WebsiteIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>URL</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <MagnifyingGlassIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    onChange={(event: any) => setDomainValue(event.target.value)}
                    value={domainValue}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='www.google.com'
                  />
                  <input
                    type='text'
                    className='hidden'
                    onChange={() => null}
                    value={flowData.data.label?.origin && flowData.data.label.origin}
                    data-type='origin'
                  />
                  <input
                    type='text'
                    onChange={() => null}
                    className='hidden'
                    value={flowData.data.label?.href && flowData.data.label.href}
                    data-type='href'
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

export function DomainNodeContext({
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
          onClick={async (event) => {
            const domain = nodeData[0].value;

            const resp = await api.get(`/extract/domain/ip?domain=${domain}`);
            if (resp.data) {
              console.log(resp.data);
              resp.data.ipv4.map((ip: string, idx: number) => {
                console.log('ipv4', ip);
                const newId = `ip4${getId()}`;
                let bounds = node.getBoundingClientRect();
                const newNode = addNode(
                  newId,
                  'ip',
                  reactFlowInstance.project({
                    x: bounds.x,
                    y: bounds.y + 50 + idx * 120,
                  }),
                  {
                    label: ip,
                  }
                );
                addEdge(parentId, newId);
                return null;
              });
              resp.data.ipv6.map((ip: string, idx: number) => {
                console.log('ipv6', ip);
                const newId = `ip6${getId()}${idx}`;
                let bounds = node.getBoundingClientRect();
                const newNode = addNode(
                  newId,
                  'ip',
                  reactFlowInstance.project({
                    x: bounds.x + 360,
                    y: bounds.y + 50 + idx * 120,
                  }),
                  {
                    label: ip,
                  }
                );
                console.log(newNode);
                addEdge(parentId, newId);
                return null;
              });
            }
          }}
          className={classNames(
            'hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
          )}
        >
          <IpIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          To IP
        </button>
      </div>
      <div>
        <button
          onClick={async (event) => {
            let domain = null;
            if (nodeData[1].value) {
              domain = nodeData[1].value;
            } else {
              domain = nodeData[0].value ? `https://${nodeData[0].value}` : null;
            }
            if (domain) {
              const resp = await api.get(`/extract/domain/whois?domain=${domain}`);
              if (resp.data) {
                const newId = `whois${getId()}`;
                let bounds = node.getBoundingClientRect();
                addNode(
                  newId,
                  'whois',
                  reactFlowInstance.project({
                    x: bounds.x + 360,
                    y: bounds.y + 50,
                  }),
                  {
                    label: resp.data,
                  }
                );
                addEdge(parentId, newId);
              }
            }
          }}
          className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
        >
          <DocumentMagnifyingGlassIcon
            className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500'
            aria-hidden='true'
          />
          To WHOIS
        </button>
      </div>
      <div>
        <button
          onClick={(event) => {
            let rect = node.getBoundingClientRect();
            const domain = nodeData[0]?.value;
            console.log('domain', domain);
            if (domain) {
              api.get(`/extract/domain/dns?domain=${domain}`).then((resp) => {
                console.log(resp.data);
                let idx = 0;
                for (const [key, value] of Object.entries(resp.data)) {
                  if (value) {
                    idx++;
                    const nodeId = `dns${getId()}${idx}`;
                    addNode(
                      nodeId,
                      'dns',
                      reactFlowInstance.project({
                        x: rect.x + 160,
                        y: rect.y + 140 + idx * 180,
                      }),
                      {
                        label: [
                          {
                            value,
                            type: key,
                          },
                        ],
                      }
                    );
                    addEdge(parentId, nodeId);
                  }
                }
              });
            }
          }}
          className={classNames(
            'hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
          )}
        >
          <CogIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          To DNS
        </button>
      </div>
      <div>
        <button
          onClick={(event) => {
            let rect = node.getBoundingClientRect();
            const domain = nodeData[0]?.value;
            if (domain && domain !== '') {
              api.get(`/extract/domain/subdomains?domain=${domain}`).then((resp) => {
                console.log(resp.data);
                const nodeId = `sd${getId()}`;
                addNode(
                  nodeId,
                  'subdomain',
                  reactFlowInstance.project({
                    x: rect.x + 160,
                    y: rect.y + 140,
                  }),
                  {
                    ...resp.data,
                  }
                );
                addEdge(parentId, nodeId);
              });
            }
          }}
          className={classNames(
            'hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
          )}
        >
          <WindowIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          To subdomains
        </button>
      </div>
      <div>
        <button
          onClick={(event) => {
            let rect = node.getBoundingClientRect();
            const domain = nodeData[0]?.value;
            if (domain && domain !== '') {
              api.get(`/extract/domain/emails?domain=${domain}`).then((resp) => {
                console.log(resp.data);
                resp.data.forEach((email: string, idx: number) => {
                  const nodeId = `e${getId()}${idx}`;
                  addNode(
                    nodeId,
                    'email',
                    reactFlowInstance.project({
                      x: rect.x + 160,
                      y: rect.y + 140 + idx * 140,
                    }),
                    {
                      email,
                    }
                  );
                  addEdge(parentId, nodeId);
                });
              });
            }
          }}
          className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
        >
          <WindowIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          To emails
        </button>
      </div>
      <div>
        <button
          onClick={(event) => {
            let rect = node.getBoundingClientRect();
            let domain = nodeData[0]?.value;
            if (domain && domain !== '') {
              if (domain.includes('www.')) domain.replace('www.', '');
              event.preventDefault();
              api
                .get(`/ghdb/dorks/crawl?query=${domain}&pages=${3}`)
                .then((resp) => {
                  let idx = 0;
                  for (const [resultType, results] of Object.entries(resp.data)) {
                    idx += 1;
                    if (results) {
                      let newNode: any = null;
                      // @ts-ignore
                      results.forEach((result, rIdx) => {
                        const pos = {
                          x: rect.x + 260,
                          y: !newNode ? rIdx * result.description.length + 300 : newNode.y + 200,
                        };
                        const nodeId = `r${getId()}`;
                        newNode = addNode(
                          nodeId,
                          'result',
                          {
                            x: rIdx % 2 === 0 ? rect.x + 420 : rect.x + 1130,
                            // y: rIdx % 2 === 0 ? (totalLines * 22)  : ((totalLines - rIdx) * 22) ,
                            y:
                              rIdx % 2 === 0
                                ? rIdx * 60 - rect.y + Math.ceil(result.description.length / 60) * 50
                                : (rIdx - 1) * 60 - rect.y + Math.ceil(result.description.length / 60) * 50,
                          },
                          {
                            label: result,
                          }
                        );
                        addEdge(node.dataset.id, nodeId);
                        console.log(nodeId, result.description.length, newNode, pos);
                      });
                    }
                  }
                })
                .catch((error) => {
                  console.warn(error);
                });
            }
          }}
          className={classNames(
            'hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
          )}
        >
          <WindowIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          To google
        </button>
      </div>
    </div>
  );
}
