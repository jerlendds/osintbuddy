import { Icon } from '@components/Icons';

export default function ContextAction({

  nodeCtx: ctx,
  transforms,
  sendJsonMessage,
  closeMenu
}: {
  nodeCtx: JSONObject
  transforms: JSONObject[]
  sendJsonMessage: Function
  closeMenu: Function
}) {

  return (
    <>
      <div className='node-context max-h-32 overflow-y-scroll'>
        {transforms?.map((transform: any) => {
          return (
            <div key={transform.label}>
              <button
                className='capitalize'
                onClick={(e) => {
                  e.preventDefault()
                  closeMenu()
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
                }}
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
