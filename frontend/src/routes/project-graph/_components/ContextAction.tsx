import { JSONObject } from '@/globals';
import { Icon } from '@components/Icons';
import { XYPosition } from 'reactflow';

export default function ContextAction({
  nodeContext: nodeCtx,
  transforms,
  sendJsonMessage,
}: {
  nodeContext: JSONObject
  transforms: string[]
  sendJsonMessage: Function
}) {
  console.log('nodeContext', nodeCtx, transforms)
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
                      id: nodeCtx.id,
                      position: nodeCtx.position,
                      transform: transform.label,
                      type: nodeCtx.label,
                      data: nodeCtx.data,
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
