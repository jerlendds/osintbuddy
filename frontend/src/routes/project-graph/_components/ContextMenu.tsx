import { useAppSelector } from '@/app/hooks';
import { isSidebarOpen } from '@/features/settings/settingsSlice';
import { api, nodesService } from '@/services';
import { JSXElementConstructor, memo, useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { XYPosition } from 'reactflow';

const useMultiselectContext = ({
  ctxPosition,
  setShowMenu,
  setCtx: clearCtx,
  hasSelection,
  showMenu,
  setCtxPosition,
}: {
  setShowMenu: Function;
  setCtx: Function;
  ctxPosition: XYPosition;
  hasSelection: boolean;
  showMenu: boolean;
  setCtxPosition: Function;
}) => {
  const [nodes, setNodes] = useState<HTMLElement | null>(null);

  const handleMultiSelectMenu = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();
      setShowMenu(true);
      console.log('!hasSelection', ctxPosition, !hasSelection);
      setCtxPosition({
        y: event.clientY - 20,
        x: event.clientX - 20,
      });
      console.log('!hasSelection', !hasSelection)
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
    [hasSelection, ctxPosition.x, ctxPosition.y]
  );

  const handleClick = useCallback(() => {
    console.log('setShowMenu(false)');
    clearCtx() || setShowMenu(false);
  }, [setShowMenu]);

  useEffect(() => {
    document.addEventListener('click', handleClick);
    document.addEventListener('contextmenu', handleMultiSelectMenu);

    return () => {
      document.addEventListener('click', handleClick);
      document.removeEventListener('contextmenu', handleMultiSelectMenu);
    };
  });

  return { nodes };
};

const ContextMenu = ({
  menu,
  showMenu,
  transforms,
  node,
  setShowMenu,
  clearCtx,
  ctxPosition,
  setCtxPosition,
}: {
  setTransforms: Function;
  transforms: string[];
  setShowMenu: Function;
  label: string;
  menu: Function;
  showMenu: boolean;
  node: JSONObject;
  ctxPosition: XYPosition;
  clearCtx: Function;
  setCtxPosition: Function;
}) => {
  // @todo implement support for multi-select transforms?
  // let data: Array<JSONObject> = [];
  // if (nodes) {
  //   data = [...nodes.querySelectorAll<HTMLInputElement | HTMLElement>('[data-label]')].map((n) =>
  //     n instanceof HTMLInputElement ? n.value : n.textContent
  //   );
  // }
  console.log('before useMultiselectContext', ctxPosition, node);
  const { nodes } = useMultiselectContext({
    ctxPosition,
    setCtx: clearCtx,
    setShowMenu,
    showMenu,
    hasSelection: !!node,
    setCtxPosition,
  });
  // const showSidebar = useAppSelector((state) => isSidebarOpen(state));
  return (
    <>
      <div
        id='context-menu'
        className='z-[999] absolute'
        style={{
          top: ctxPosition.y,
          left: ctxPosition.x,
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
