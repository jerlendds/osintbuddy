import { useAppSelector } from '@/app/hooks';
import { isSidebarOpen } from '@/features/settings/settingsSlice';
import React, { useCallback, useEffect, useState } from 'react';

const useContextMenu = () => {
  const [xPos, setXPos] = useState('0px');
  const [yPos, setYPos] = useState('0px');
  const [showMenu, setShowMenu] = useState(false);
  const [targetNode, setTargetNode] = useState(null);
  const handleContextMenu = useCallback(
    (e: any) => {
      e.preventDefault();
      // @todo implement support for when multiple nodes are selected
      if (e.target.closest('.react-flow__nodesselection-rect')) {
      }
      setXPos(`${e.pageX}px`);
      setYPos(`${e.pageY}px`);
      setShowMenu(true);
      setTargetNode(e.target.closest('.react-flow__node'));
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

  return { xPos, yPos, showMenu, targetNode };
};

const ContextMenu = ({ menu }: any) => {
  const { xPos, yPos, showMenu, targetNode } = useContextMenu();
  const showSidebar = useAppSelector((state) => isSidebarOpen(state));
  return (
    <>
      {showMenu ? (
        <div
          style={{
            zIndex: 999,
            top: yPos,
            left: `calc(${xPos} - ${showSidebar ? 16 : 3}rem)`,
            position: 'absolute',
          }}
        >
          {menu({ node: targetNode })}
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default ContextMenu;
