import { Icon } from '@components/Icons';
import { XYPosition } from 'reactflow';

export default function ContextAction({
  nodeCtx: ctx,
  transforms,
  sendJsonMessage,
}: {
  nodeCtx: JSONObject
  transforms: string[]
  sendJsonMessage: Function
}) {
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
                      id: ctx.id,
                      type: ctx.label,
                      data: ctx.data,
                      position: ctx.position,
                      transform: transform.label,
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
