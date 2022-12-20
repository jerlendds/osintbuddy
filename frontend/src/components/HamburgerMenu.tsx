import React from 'react';
import classNames from 'classnames';

interface HamburgerProps {
  isOpen: boolean;
  onClick: Function;
  className?: string;
}

function HamburgerMenu({ isOpen, onClick, className }: HamburgerProps) {
  return (
    <button onClick={() => onClick()} className={classNames('hamburger', className, { 'is-active': isOpen })}>
      <span className='line' />
      <span className='line' />
      <span className='line' />
    </button>
  );
}

export default HamburgerMenu;
