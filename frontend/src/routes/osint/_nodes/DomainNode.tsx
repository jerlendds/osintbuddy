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
import { toast } from 'react-toastify';
import { Handle, Position } from 'reactflow';
import { NodeContextProps } from '.';
import { handleStyle } from './styles';

export function DomainNode({ flowData }: any) {
  const initialValue = (flowData.data && flowData.data.domain) || '';
  const [domainValue, setDomainValue] = useState<string>(initialValue);
  const origin = flowData.data?.origin;
  const href = flowData.data?.href;
  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' style={handleStyle} />
      <Handle position={Position.Top} id='t1' key='t1' type='source' style={handleStyle} />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' style={handleStyle} />
      <Handle position={Position.Left} id='l1' key='l1' type='target' style={handleStyle} />
      <div className='node container'>
        <div className='highlight from-persian-400/0 via-persian-400 to-persian-400/0' />
        <div className='header bg-persian bg-opacity-60'>
          <GripIcon className='h-5 w-5' />
          <div className='text-container'>
            <p>
              <span>ID: </span>
              {flowData.id}
            </p>
            <p>Domain</p>
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
                  <input
                    type='text'
                    data-type='domain'
                    onChange={(event: any) => setDomainValue(event.target.value)}
                    value={domainValue}
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
    <div className='node-context'>
      <div>
        <button
          onClick={async (event) => {
            const domain = nodeData[0].value;
            toast.info("Fetching IP")
            const resp = await api.get(`/extract/domain/ip?domain=${domain}`);
            if (resp.data) {
              resp.data.ipv4.map((ip: string, idx: number) => {
                const newId = `${getId()}`;
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
                const newId = `${getId()}`;
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
        >
          <IpIcon />
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
            toast.info("Fetching WHOIS");
            if (domain) {
              const resp = await api.get(`/extract/domain/whois?domain=${domain}`);
              if (resp.data) {
                const newId = `${getId()}`;
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
        >
          <DocumentMagnifyingGlassIcon />
          To WHOIS
        </button>
      </div>
      {/* <div>
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
                    const nodeId = `${getId()}`;
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
        >
          <CogIcon />
          To DNS
        </button>
      </div> */}
      <div>
        <button
          onClick={(event) => {
            let rect = node.getBoundingClientRect();
            const domain = nodeData[0]?.value;
            if (domain && domain !== '') {
              toast.info("Fetching subdomains");
              api.get(`/extract/domain/subdomains?domain=${domain}`).then((resp) => {
                const nodeId = `${getId()}`;
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
        >
          <WindowIcon />
          To subdomains
        </button>
      </div>
      <div>
        <button
          onClick={(event) => {
            let rect = node.getBoundingClientRect();
            const domain = nodeData[0]?.value;
            if (domain && domain !== '') {
              toast.info("Fetching emails");
              api.get(`/extract/domain/emails?domain=${domain}`).then((resp) => {
                resp.data.forEach((email: string, idx: number) => {
                  const nodeId = `${getId()}`;
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
        >
          <AtSymbolIcon />
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
              toast.info("Fetching Google search results");
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
        >
          <GoogleIcon />
          To google
        </button>
      </div>
      <div>
        <button
          onClick={(event) => {
            const nodeId = `${getId()}`;
            let rect = node.getBoundingClientRect();
            toast.info("Fetching trace route");
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
          title='urlscan.io is a free service to scan and analyse websites. When a URL is submitted to urlscan.io, an automated process will browse to the URL like a regular user and record the activity that this page navigation creates. This includes the domains and IPs contacted, the resources (JavaScript, CSS, etc) requested from those domains, as well as additional information about the page itself. urlscan.io will take a screenshot of the page, record the DOM content, JavaScript global variables, cookies created by the page, and a myriad of other observations. If the site is targeting the users one of the more than 400 brands tracked by urlscan.io, it will be highlighted as potentially malicious in the scan results.'
          onClick={(event) => {
            const nodeId = `${getId()}`;
            let bounds = node.getBoundingClientRect();
            toast.info("Fetching urlscan.io results");
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
        >
          <PaperClipIcon />
          To scan URL
        </button>
      </div>
      <div>
        <button
          onClick={(event) => {
            let bounds = node.getBoundingClientRect();
            const domain = nodeData[0].value;
            toast.info("Fetching URLs on page");
            api.get(`/extract/url/urls?url=${encodeURIComponent(domain)}`).then((resp) => {
              resp.data.forEach((url: string, idx: number) => {
                const nodeId = `${getId()}`;
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
        >
          <PaperClipIcon />
          To URLs on page
        </button>
      </div>
    </div>
  );
}
