import { useState } from 'react';
import { Position, Handle } from 'reactflow';
import { Column, useTable } from 'react-table';
import { GripIcon, IpIcon } from '@/components/Icons';
import { NodeContextProps } from '.';
import api from '@/services/api.service';
import { capitalize } from '../OsintPage';
import { AtSymbolIcon, LinkIcon, PaperClipIcon, WindowIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

export function UrlNode({ flowData, deleteNode }: any) {
  const [url, setUrl] = useState<string>(flowData.data?.url);
  let urlObj = null;

  try {
    urlObj = new URL(url || 'https://osintbuddy.com');
  } catch (e) {
    console.warn(e);
  }
  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className=' flex flex-col min-w-2xl w-[26rem] justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-grape text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>URL</p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display'>
              <span className='text-xs text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
          </div>
          <IpIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full h-full p-2'>
          <div className='md:flex-col md:flex w-full h-full md:flex-1  md:justify-between '>
            <form onSubmit={(event) => handleSubmit(event)} className='flex items-start flex-col max-w-2xl h-full'>
              <>
                <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
                  <form className='flex items-start flex-col'>
                    <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>URL</p>
                    <div className='flex items-center mb-1'>
                      <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                        <LinkIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                        <input
                          type='text'
                          data-type='url'
                          value={url}
                          onChange={(e) => setUrl(e.currentTarget.value)}
                          className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-96 bg-light-200 focus:bg-light-50'
                          placeholder='example@gmail.com'
                        />
                      </div>
                    </div>
                  </form>
                </div>
                <input data-type='origin' readOnly value={urlObj?.origin || ''} className='hidden' />
                <input data-type='href' readOnly value={urlObj?.href || ''} className='hidden' />
                <input value={urlObj?.host || ''} data-type='host' readOnly className='hidden' />
              </>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function UrlNodeContext({
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
    <>
      <div className='py-1'>
        <div>
          <button
            title='urlscan.io is a free service to scan and analyse websites. When a URL is submitted to urlscan.io, an automated process will browse to the URL like a regular user and record the activity that this page navigation creates. This includes the domains and IPs contacted, the resources (JavaScript, CSS, etc) requested from those domains, as well as additional information about the page itself. urlscan.io will take a screenshot of the page, record the DOM content, JavaScript global variables, cookies created by the page, and a myriad of other observations. If the site is targeting the users one of the more than 400 brands tracked by urlscan.io, it will be highlighted as potentially malicious in the scan results.'
            onClick={() => {
              const url = nodeData[0].value;
              // @ts-ignore
              if (url) window?.open(url, '_blank').focus();
            }}
            className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
          >
            <WindowIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
            Open in new tab
          </button>
        </div>
        <div>
          <button
            title='urlscan.io is a free service to scan and analyse websites. When a URL is submitted to urlscan.io, an automated process will browse to the URL like a regular user and record the activity that this page navigation creates. This includes the domains and IPs contacted, the resources (JavaScript, CSS, etc) requested from those domains, as well as additional information about the page itself. urlscan.io will take a screenshot of the page, record the DOM content, JavaScript global variables, cookies created by the page, and a myriad of other observations. If the site is targeting the users one of the more than 400 brands tracked by urlscan.io, it will be highlighted as potentially malicious in the scan results.'
            onClick={(event) => {
              const nodeId = `us${getId()}`;
              let bounds = node.getBoundingClientRect();
              const domain = nodeData[3].value;
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
            }}
            className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
          >
            <PaperClipIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
            To URL scan
          </button>
        </div>
        <div>
          <button
            onClick={async () => {
              const domain = nodeData[3].value;

              const resp = await api.get(`/extract/domain/ip?domain=${domain}`);
              if (resp.data) {
                console.log(resp.data);
                resp.data.ipv4.map((ip: string, idx: number) => {
                  console.log('ipv4', ip);
                  const newId = `i${getId()}`;
                  let bounds = node.getBoundingClientRect();
                  const newNode = addNode(
                    newId,
                    'ip',
                    {
                      x: bounds.x,
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
              'hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
            )}
          >
            <IpIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
            To IP
          </button>
        </div>
        <div>
          <button
            title='urlscan.io is a free service to scan and analyse websites. When a URL is submitted to urlscan.io, an automated process will browse to the URL like a regular user and record the activity that this page navigation creates. This includes the domains and IPs contacted, the resources (JavaScript, CSS, etc) requested from those domains, as well as additional information about the page itself. urlscan.io will take a screenshot of the page, record the DOM content, JavaScript global variables, cookies created by the page, and a myriad of other observations. If the site is targeting the users one of the more than 400 brands tracked by urlscan.io, it will be highlighted as potentially malicious in the scan results.'
            onClick={() => {
              let bounds = node.getBoundingClientRect();
              const domain = nodeData[3].value;
              const nodeId = `ur${getId()}`;
              addNode(
                nodeId,
                'domain',
                {
                  x: bounds.x + 160,
                  y: bounds.y + 140,
                },
                { domain }
              );
              addEdge(parentId, nodeId);
            }}
            className='hover:bg-light-500 hover:text-gray-900 text-gray-700 group flex items-center px-4 py-2 text-sm w-full'
          >
            <PaperClipIcon className='mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500' aria-hidden='true' />
            To Domain
          </button>
        </div>
        <div>
          <button
            title='urlscan.io is a free service to scan and analyse websites. When a URL is submitted to urlscan.io, an automated process will browse to the URL like a regular user and record the activity that this page navigation creates. This includes the domains and IPs contacted, the resources (JavaScript, CSS, etc) requested from those domains, as well as additional information about the page itself. urlscan.io will take a screenshot of the page, record the DOM content, JavaScript global variables, cookies created by the page, and a myriad of other observations. If the site is targeting the users one of the more than 400 brands tracked by urlscan.io, it will be highlighted as potentially malicious in the scan results.'
            onClick={() => {
              let bounds = node.getBoundingClientRect();
              const domain = nodeData[0].value;
              api.get(`/extract/url/urls?url=${domain}`).then((resp) => {
                resp.data.forEach((url: string, idx: number) => {
                  const nodeId = `ur${getId()}`;
                  addNode(
                    nodeId,
                    'url',
                    {
                      x: bounds.x + 160,
                      y: bounds.y + idx * 110,
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
        <div>
          <button
            onClick={() => {
              let rect = node.getBoundingClientRect();
              const domain = nodeData[0]?.value;
              if (domain && domain !== '') {
                api.get(`/extract/url/emails?url=${domain}`).then((resp) => {
                  console.log(resp.data);
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
      </div>
    </>
  );
}
