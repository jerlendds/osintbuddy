import { useAppSelector } from '@/app/hooks';
import { isSidebarOpen } from '@/features/settings/settingsSlice';
import { api } from '@/services';
import { useCallback, useEffect, useState } from 'react';

const useContextMenu = (setTransforms: Function) => {
  const [xPos, setXPos] = useState('0px');
  const [yPos, setYPos] = useState('0px');
  const [showMenu, setShowMenu] = useState(false);
  const [targetNode, setTargetNode] = useState<HTMLElement | null>(null);
  const [nodeType, setNodeType] = useState<string | null | undefined>(null);

  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      setTransforms([]);

      if (event.target instanceof HTMLElement) {
        // @todo implement support for transforming when multiple nodes are selected
        // const multiSelect = event.target.closest('.react-flow__nodesselection-rect') as HTMLDivElement
        // if (multiSelect) {}
        console.log('1');
        const singleSelect = event.target.closest('.react-flow__node') as HTMLDivElement;
        if (singleSelect) {
          setTargetNode(singleSelect);
          const type = singleSelect.querySelector('[data-node-type]')?.getAttribute('data-node-type');
          if (type) {
            api.get(`/nodes/transforms?node_type=${type}`).then((resp) => {
              if (resp?.data?.transforms) {
                setTransforms(resp?.data?.transforms);
              }
            });
            setNodeType(type);
          }
        }
        setXPos(`${event.pageX}px`);
        setYPos(`${event.pageY - 20}px`);
      }
      setShowMenu(true);
    },
    [setXPos, setYPos]
  );

  const handleClick = useCallback(() => {
    showMenu && setShowMenu(false);
  }, [showMenu]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.addEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  });

  return { xPos, yPos, showMenu, setYPos, targetNode, nodeType };
};

const ContextMenu = ({ menu }: any) => {
  const [transforms, setTransforms] = useState<string[]>([]);
  const { xPos, yPos, setYPos, showMenu, targetNode, nodeType } = useContextMenu(setTransforms);

  const showSidebar = useAppSelector((state) => isSidebarOpen(state));

  let data: Array<string | null> = [];
  if (targetNode)
    data = [...targetNode.querySelectorAll<HTMLInputElement | HTMLElement>('[data-node]')].map((node) =>
      node instanceof HTMLInputElement ? node.value : node?.textContent
    );

  return (
    <>
      {showMenu ? (
        <div
          id='context-menu'
          className='z-[999] absolute'
          style={{
            top: yPos,
            left: `calc(${xPos} - ${showSidebar ? 16 : 3}rem)`,
          }}
        >
          {menu({
            data,
            transforms,
            node: targetNode,
            bounds: targetNode?.getBoundingClientRect(),
            parentId: targetNode?.getAttribute('data-id'),
            nodeType: nodeType,
          })}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default ContextMenu;
