import classNames from 'classnames';

export interface IconProps {
  className?: string
}

export function GoogleIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      stroke-width='2'
      stroke='currentColor'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M17.788 5.108a9 9 0 1 0 3.212 6.892h-8'></path>
    </svg>
  );
}
