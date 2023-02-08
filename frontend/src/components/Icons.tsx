import classNames from 'classnames';

export interface IconProps {
  className?: string;
}

export function IpIcon({ className }: IconProps) {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' enable-background='new 0 0 24 24' className={className}>
      <path d='M 12 2 C 7.6 2 4 5.6 4 10 C 4 16 12 22 12 22 C 12 22 20 16 20 10 C 20 5.6 16.4 2 12 2 z M 9 7 L 10.40625 7 L 10.40625 14 L 9 14 L 9 7 z M 12 7 L 14.40625 7 C 15.80625 7 16.6875 8.0125 16.6875 9.3125 C 16.6875 10.5125 16.00625 11.5 14.40625 11.5 L 13.40625 11.5 L 13.40625 14 L 12 14 L 12 7 z M 13.40625 8.1875 L 13.40625 10.40625 L 14.40625 10.40625 C 14.80625 10.40625 15.1875 10.10625 15.1875 9.40625 C 15.1875 8.80625 15.00625 8.1875 14.40625 8.1875 L 13.40625 8.1875 z' />
    </svg>
  );
}

export function GripIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      strokeWidth='2'
      stroke='currentColor'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M9 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0'></path>
      <path d='M9 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0'></path>
      <path d='M9 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0'></path>
      <path d='M15 5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0'></path>
      <path d='M15 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0'></path>
      <path d='M15 19m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0'></path>
    </svg>
  );
}

export function GoogleIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      strokeWidth='2'
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

export function VirusSearchIcon({ className }: IconProps) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      strokeWidth='2'
      stroke='currentColor'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M17 12a5 5 0 1 0 -5 5'></path>
      <path d='M12 7v-4'></path>
      <path d='M11 3h2'></path>
      <path d='M15.536 8.464l2.828 -2.828'></path>
      <path d='M17.657 4.929l1.414 1.414'></path>
      <path d='M17 12h4'></path>
      <path d='M21 11v2'></path>
      <path d='M12 17v4'></path>
      <path d='M13 21h-2'></path>
      <path d='M8.465 15.536l-2.829 2.828'></path>
      <path d='M6.343 19.071l-1.413 -1.414'></path>
      <path d='M7 12h-4'></path>
      <path d='M3 13v-2'></path>
      <path d='M8.464 8.464l-2.828 -2.828'></path>
      <path d='M4.929 6.343l1.414 -1.413'></path>
      <circle cx='17.5' cy='17.5' r='2.5'></circle>
      <path d='M19.5 19.5l2.5 2.5'></path>
    </svg>
  );
}

export const ShellIcon = ({ className }: IconProps) => {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className={className}
      width='24'
      height='24'
      viewBox='0 0 24 24'
      strokeWidth='2'
      stroke='currentColor'
      fill='none'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path stroke='none' d='M0 0h24v24H0z' fill='none'></path>
      <path d='M4.887 20h11.868c.893 0 1.664 -.665 1.847 -1.592l2.358 -12c.212 -1.081 -.442 -2.14 -1.462 -2.366a1.784 1.784 0 0 0 -.385 -.042h-11.868c-.893 0 -1.664 .665 -1.847 1.592l-2.358 12c-.212 1.081 .442 2.14 1.462 2.366c.127 .028 .256 .042 .385 .042z'></path>
      <path d='M9 8l4 4l-6 4'></path>
      <path d='M12 16h3'></path>
    </svg>
  );
};
