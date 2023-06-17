import { Icon } from '@components/Icons';

export default function ContextAction({
  nodeType,
  data,
  sendJsonMessage,
  parentId,
  transforms,
  bounds
}: any) {

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
                      data: [...data],
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
