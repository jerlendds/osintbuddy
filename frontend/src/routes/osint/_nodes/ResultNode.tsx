import { GoogleIcon, GripIcon, IpIcon, WebsiteIcon } from '@/components/Icons';
import { PaperClipIcon, WindowIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { Handle, Position } from 'reactflow';
import { NodeContextProps } from '.';
import { handleStyle } from './styles';

export function ResultNode({ flowData }: { flowData: any }) {
  return (
    <>
      <Handle position={Position.Left} id='l1' key='l1' type='target' style={handleStyle} />
      <Handle position={Position.Right} id='r1' key='r1' type='source' style={handleStyle} />
      <Handle position={Position.Top} id='t1' key='t1' type='target' style={handleStyle} />
      <Handle position={Position.Bottom} id='b1' key='b1' type='target' style={handleStyle} />
      <div className='min-w-[500px]  max-w-2xl flex node side-container'>
        <div className='node highlight from-info-200/0 via-info-200 to-info-200/0'></div>
        <div className='side-header bg-info-200 bg-opacity-60 '>
          <GoogleIcon />
          <div className='flex-1 justify-center -mt-5 flex flex-col'>
            <GripIcon />
          </div>
        </div>
        <ul role='list' className='node-wrap'>
          <li>
            <div className='text-slate-400'>
              <p data-node='title' className='hover:cursor-default text-lg text-inherit break-words text-slate-300'>
                {flowData.data && flowData.data.title && flowData.data.title}
              </p>
              <p data-node='description' className='hover:cursor-default text-sm text-inherit max-w-xl break-words'>
                {flowData.data && flowData.data.description && flowData.data.description}
              </p>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(flowData.data.url);
                  toast.success('The URL has been copied to your clipboard');
                }}
                className='flex items-center'
              >
                <p
                  title='Click to copy the URL'
                  data-node='link'
                  className='text-sm text-inherit break-words text-info-200 max-w-xl'
                >
                  {flowData.data && flowData.data.url && flowData.data.url}
                </p>
                <PaperClipIcon className='w-5 h-5 text-inherit text-info-200 mx-1' />
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}

export function ResultNodeContext({
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
    <div>
      <div className='node-context'>
        <button
          onClick={(event) => {
            const url = nodeData[2].innerText;
            // @ts-ignore
            if (url) window?.open(url, '_blank').focus();
          }}
        >
          <WindowIcon aria-hidden='true' />
          Open in new tab
        </button>
      </div>
      <div className='node-context'>
        <button
          onClick={(event) => {
            const nodeId = `${getId()}`;
            let bounds = node.getBoundingClientRect();
            const url = new URL(nodeData[2].innerText);
            toast.info('Transforming to domain');
            addNode(
              nodeId,
              'domain',
              {
                x: bounds.x + 220,
                y: bounds.y + 80,
              },
              {
                href: url.href,
                origin: url.origin,
                domain: url.host,
              }
            );
            addEdge(parentId, nodeId);
          }}
        >
          <WebsiteIcon />
          To Domain
        </button>
      </div>
      <div className='node-context'>
        <button
          onClick={(event) => {
            const nodeId = `${getId()}`;
            let bounds = node.getBoundingClientRect();
            const url = nodeData[2].innerText;
            toast.info('Transforming to URL');
            addNode(
              nodeId,
              'url',
              {
                x: bounds.x + 120,
                y: bounds.y + 80,
              },
              {
                url,
              }
            );
            addEdge(parentId, nodeId);
          }}
        >
          <WebsiteIcon />
          To Url
        </button>
      </div>
    </div>
  );
}
