import { useAppSelector } from '@/app/hooks';
import { isSidebarOpen } from '@/features/settings/settingsSlice';
import { JSONObject } from '@/globals';
import { api, nodesService } from '@/services';
import { JSXElementConstructor, memo, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { XYPosition } from 'reactflow';

const useMultiselectContext = ({
  setCtxPosition,
  setShowMenu,
  clearCtx,
  hasSelection,
}: {
  clearCtx: Function;
  setCtxPosition: Function;
  setShowMenu: Function;
  hasSelection: boolean;
}) => {
  const [nodes, setNodes] = useState<HTMLElement | null>(null);

  const handleContextMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      setShowMenu(true);
      setCtxPosition({
        y: event.clientY - 20,
        x: event.clientX - 20,
      });
      if (!hasSelection) {
        clearCtx();
        return;
      }
      if (event.target instanceof HTMLElement) {
        // @todo implement support for transforming when multiple nodes are selected
        const multiSelect = event.target.closest('.react-flow__nodesselection-rect') as HTMLDivElement;
        if (multiSelect) {
        }
      }
    },
    [setCtxPosition]
  );

  const handleClick = useCallback(() => {
    setShowMenu(false);
  }, [setShowMenu]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.addEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  });

  return { nodes };
};

interface NodeMenu {
  id: string;
  node: HTMLElement;
  data: JSONObject;
  label: string;
  transforms: string[];
  bounds: DOMRect;
}

const ContextMenu = ({
  menu,
  position,
  showMenu,
  transforms,
  node,
  setShowMenu,
  setCtxPosition,
  clearCtx,
}: {
  setTransforms: Function;
  transforms: string[];
  setShowMenu: Function;
  label: string;
  menu: Function;
  position: XYPosition;
  showMenu: boolean;
  node: JSONObject;
  setCtxPosition: Function;
  clearCtx: Function;
}) => {
  // @todo implement support for multi-select transforms?
  // let data: Array<JSONObject> = [];
  // if (nodes) {
  //   data = [...nodes.querySelectorAll<HTMLInputElement | HTMLElement>('[data-label]')].map((n) =>
  //     n instanceof HTMLInputElement ? n.value : n.textContent
  //   );
  // }
  const { nodes } = useMultiselectContext({
    clearCtx,
    setCtxPosition,
    setShowMenu,
    hasSelection: node,
  });
  // const showSidebar = useAppSelector((state) => isSidebarOpen(state));

  return (
    <>
      <div
        id='context-menu'
        className='z-[999] absolute'
        style={{
          top: position.y,
          left: position.x,
        }}
      >
        {showMenu &&
          menu({
            ctx: node,
            transforms,
          })}
      </div>
    </>
  );
};
export default ContextMenu;
