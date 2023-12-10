import { Icon } from '@components/Icons';
import { toast } from 'react-toastify';

export default function ContextAction({
  nodeCtx: ctx,
  transforms,
  sendJsonMessage,
  closeMenu
}: {
  nodeCtx: JSONObject | null
  transforms: JSONObject[]
  sendJsonMessage: Function
  closeMenu: Function
}) {

  return (
    <>
      {transforms && ctx && <>
        <div className='node-context max-h-32 overflow-y-scroll'>
          {transforms.map((transform: any) => {
            return (
              <div key={transform.label}>
                <button
                  className='capitalize'
                  onClick={(e) => {
                    e.preventDefault()
                    closeMenu()
                    if (ctx) {
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
                    } else {
                      toast.error("Ctx not found!")
                    }
                  }}
                >
                  <Icon icon={transform.icon}></Icon>
                  {transform.label}
                </button>
              </div>
            );
          })}
        </div>
      </>}
    </>
  );
}
