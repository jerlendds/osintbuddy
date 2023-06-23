import { useAppSelector } from '@/app/hooks';
import { isSidebarOpen } from '@/features/settings/settingsSlice';
import { api, nodesService } from '@/services';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const useContextMenu = (setTransforms: Function) => {
  const [xPos, setXPos] = useState('0px');
  const [yPos, setYPos] = useState('0px');
  const [showMenu, setShowMenu] = useState(false);
  const [targetNode, setTargetNode] = useState<HTMLElement | null>(null);
  const [label, setNodeLabel] = useState<string | null | undefined>(null);

  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      if (event.target instanceof HTMLElement) {
        setXPos(`${event.pageX}px`);
        setYPos(`${event.pageY - 20}px`);
        // @todo implement support for transforming when multiple nodes are selected
        // const multiSelect = event.target.closest('.react-flow__nodesselection-rect') as HTMLDivElement
        // if (multiSelect) {}

        const singleSelect = event.target.closest('.react-flow__node') as HTMLDivElement;
        if (singleSelect) {
          setTargetNode(singleSelect);
          const label = singleSelect.querySelector('[data-node-type]')?.getAttribute('data-node-type');
          if (label)
            nodesService
              .getTransforms({ label })
              .then((data) => {
                setTransforms(data.transforms);
                setNodeLabel(label);
              })
              .catch((error) => {
                toast.error(`Error: ${error}`);
                setTransforms([]);
                setNodeLabel(label);
              });
        } else {
          setTargetNode(null);
          setTransforms([]);
          setNodeLabel(null);
          return;
        }
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

  return { xPos, yPos, showMenu, targetNode, label };
};

const ContextMenu = ({ menu }: any) => {
  const [transforms, setTransforms] = useState<string[]>([]);
  const { xPos, yPos, showMenu, targetNode, label } = useContextMenu(setTransforms);

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
            label,
            data,
            transforms,
            node: targetNode,
            bounds: targetNode?.getBoundingClientRect(),
            parentId: targetNode?.getAttribute('data-id'),
          })}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default ContextMenu;
