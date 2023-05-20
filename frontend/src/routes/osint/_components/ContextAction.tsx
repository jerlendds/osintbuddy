import { toast } from 'react-toastify';
import { getId } from '..';
import { api } from '@/services';
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Icon } from '@components/Icons';

export default function ContextAction({
  node,
  nodeType,
  nodeData,
  addEdge,
  addNode,
  deleteNode,
  sendJsonMessage,
  parentId,
  lastMessage,
  setMessageHistory,
}: any) {
  const [transforms, setTransforms] = useState<string[]>([]);

  let bounds = node?.getBoundingClientRect();
  useEffect(() => {
    let ignore = false;
    api.get(`/nodes/transforms?node_type=${nodeType}`).then((resp) => {
      if (!ignore && resp?.data?.transforms) setTransforms(resp?.data?.transforms);
    });
    return () => {
      ignore = true;
    };
  }, [nodeType]);

  return (
    <>
      <div className='node-context'>
        {transforms?.map((transform: any) => {
          return (
            <div key={transform.label}>
              <button
                className='capitalize'
                onClick={() =>
                  sendJsonMessage({
                    action: 'transform:node',
                    node: {
                      parentId,
                      transform: transform.label,
                      type: nodeType,
                      position: { x: bounds.x, y: bounds.y },
                      data: [...nodeData],
                    },
                  })
                }
              >
                <Icon icon={transform.icon}></Icon>
                {transform.label}
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}
