import { GripIcon, WebsiteIcon, IpIcon, GoogleIcon } from '@/components/Icons';
import api from '@/services/api.service';
import {
  AtSymbolIcon,
  CogIcon,
  DocumentMagnifyingGlassIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  WindowIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { NodeContextProps } from '.';

export function DomainNode({ flowData }: any) {
  const initialValue = (flowData.data && flowData.data.domain) || '';
  const [domainValue, setDomainValue] = useState<string>(initialValue);
  const origin = flowData.data?.origin;
  const href = flowData.data?.href;
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
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>
              {' '}
              <span className='text-[0.5rem] text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display font-bold'>Domain</p>
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
                  <input type='text' className='hidden' onChange={() => null} value={origin || ''} data-type='origin' />
                  <input type='text' onChange={() => null} className='hidden' value={href || ''} data-type='href' />
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
          onClick={async (event) => {
            const domain = nodeData[0].value;

            const resp = await api.get(`/extract/domain/ip?domain=${domain}`);
            if (resp.data) {
              resp.data.ipv4.map((ip: string, idx: number) => {
                const newId = `ip${getId()}`;
                let bounds = node.getBoundingClientRect();
                const newNode = addNode(
                  newId,
                  'ip',
                  {
                    x: bounds.x + 200,
                    y: bounds.y + 50 + idx * 120,
                  },
                  {
                    ip,
                  }
                );
                addEdge(parentId, newId);
                return null;
              });
              resp.data.ipv6.map((ip: string, idx: number) => {
                const newId = `i${getId()}`;
                let bounds = node.getBoundingClientRect();
                const newNode = addNode(
                  newId,
                  'ip',
                  {
                    x: bounds.x + 360,
                    y: bounds.y + 50 + idx * 120,
                  },
                  {
                    ip,
                  }
                );
                addEdge(parentId, newId);
                return null;
              });
            }
          }}
          className={classNames(
            'hover:bg-slate-800 hover:text-slate-400 text-slate-400 group flex items-center px-4 py-2 text-sm w-full'
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
            // if (nodeData[1].value) {
            //   domain = nodeData[1].value;
            // } else {
            //   domain = nodeData[0].value ? `https://${nodeData[0].value}` : null;
            // }
            if (nodeData[0].value) {
              domain = nodeData[0].value;
            }
            if (domain) {
              const resp = await api.get(`/extract/domain/whois?domain=${domain}`);
              if (resp.data) {
                const newId = `whois${getId()}`;
                let bounds = node.getBoundingClientRect();
                addNode(
                  newId,
                  'whois',
                  {
                    x: bounds.x + 360,
                    y: bounds.y + 50,
                  },
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
            if (domain) {
              api.get(`/extract/domain/dns?domain=${domain}`).then((resp) => {
                let idx = 0;
                for (const [key, value] of Object.entries(resp.data)) {
                  if (value) {
                    idx++;
                    const nodeId = `dns${getId()}`;
                    addNode(
                      nodeId,
                      'dns',
                      {
                        x: rect.x + 160,
                        y: rect.y + 140 + idx * 180,
                      },
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
                const nodeId = `sd${getId()}`;
                addNode(
                  nodeId,
                  'subdomain',
                  {
                    x: rect.x + 160,
                    y: rect.y + 140,
                  },
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
                resp.data.forEach((email: string, idx: number) => {
                  const nodeId = `e${getId()}`;
                  addNode(
                    nodeId,
                    'email',
                    {
                      x: rect.x + 160,
                      y: rect.y + 140 + idx * 140,
                    },
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
          <AtSymbolIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          To emails
        </button>
      </div>
      <div>
        <button
          onClick={(event) => {
            let bounds = node.getBoundingClientRect();
            let domain = nodeData[0]?.value;
            if (domain && domain !== '') {
              if (domain.includes('www.')) domain.replace('www.', '');
              event.preventDefault();
              api
                .get(`/extract/google/search?query=${domain}&pages=${3}`)
                .then((resp) => {
                  let idx = 0;
                  idx += 1;
                  if (resp.data) {
                    let newNode: any = null;
                    // @ts-ignore

                    resp.data.forEach((result, rIdx) => {
                      const pos = {
                        x: bounds.xPos + 260,
                        y: !newNode ? rIdx * result.description.length + 300 : newNode.y + 200,
                      };
                      const nodeId = getId();
                      newNode = addNode(
                        nodeId,
                        'result',
                        {
                          x: rIdx % 2 === 0 ? bounds.xPos + 420 : bounds.xPos + 1130,
                          y:
                            rIdx % 2 === 0
                              ? rIdx * 60 - bounds.yPos + Math.ceil(result.description.length / 60) * 100
                              : (rIdx - 1) * 60 - bounds.yPos + Math.ceil(result.description.length / 60) * 100,
                        },
                        {
                          ...result,
                        }
                      );
                      addEdge(parentId, nodeId);
                    });
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
          <GoogleIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          To google
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
                {
                  x: rect.x + 160,
                  y: rect.y + 80,
                },
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
          title='urlscan.io is a free service to scan and analyse websites. When a URL is submitted to urlscan.io, an automated process will browse to the URL like a regular user and record the activity that this page navigation creates. This includes the domains and IPs contacted, the resources (JavaScript, CSS, etc) requested from those domains, as well as additional information about the page itself. urlscan.io will take a screenshot of the page, record the DOM content, JavaScript global variables, cookies created by the page, and a myriad of other observations. If the site is targeting the users one of the more than 400 brands tracked by urlscan.io, it will be highlighted as potentially malicious in the scan results.'
          onClick={(event) => {
            const nodeId = `us${getId()}`;
            let bounds = node.getBoundingClientRect();
            api.get(`/extract/domain/urls?domain=${nodeData[0].value}`).then((resp) => {
              addNode(
                nodeId,
                'urlscan',
                {
                  x: bounds.x + 160,
                  y: bounds.y + 80,
                },
                { ...resp.data }
              );
              addEdge(parentId, nodeId);
            });
          }}
          className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
        >
          <PaperClipIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          To scan URL
        </button>
      </div>
      <div>
        <button
          onClick={(event) => {
            let bounds = node.getBoundingClientRect();
            const domain = nodeData[0].value;
            api.get(`/extract/url/urls?url=${encodeURIComponent(domain)}`).then((resp) => {
              resp.data.forEach((url: string, idx: number) => {
                const nodeId = `ur${getId()}`;
                addNode(
                  nodeId,
                  'url',
                  {
                    x: bounds.x + 160,
                    y: bounds.y + (idx + 140),
                  },
                  { url, domain }
                );
                addEdge(parentId, nodeId);
              });
            });
          }}
          className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
        >
          <PaperClipIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
          To URLs
        </button>
      </div>
    </div>
  );
}
