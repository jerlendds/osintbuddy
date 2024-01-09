import classNames from 'classnames';
import Sprite from '@assets/images/tabler-sprite.svg';

export const Icon = ({ icon, className }: { icon: string, className?: string }) => {
  // TODO: Optimize this?
  return (
    <>
      <svg className={className ? className : 'h-5 w-5'} fill="none" stroke="currentColor">
        <use href={`${Sprite}#tabler-${icon}`} />
      </svg>
    </>
  );
};


export interface IconProps {
  className?: string;
}



export function GithubIcon({ className }: IconProps) {
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
      <path d='M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5'></path>
    </svg>
  );
}

export function HeroBackground({ className }: IconProps) {
  return (
    <svg aria-hidden='true' viewBox='0 0 668 1069' width={668} height={1069} fill='none' className={className}>
      <defs>
        <clipPath id={`${0}-clip-path`}>
          <path fill='#fff' transform='rotate(-180 334 534.4)' d='M0 0h668v1068.8H0z' />
        </clipPath>
      </defs>
      <g opacity='.4' clipPath={`url(#${1}-clip-path)`} strokeWidth={4}>
        <path
          opacity='.3'
          d='M584.5 770.4v-474M484.5 770.4v-474M384.5 770.4v-474M283.5 769.4v-474M183.5 768.4v-474M83.5 767.4v-474'
          stroke='#334155'
        />
        <path
          d='M83.5 221.275v6.587a50.1 50.1 0 0 0 22.309 41.686l55.581 37.054a50.102 50.102 0 0 1 22.309 41.686v6.587M83.5 716.012v6.588a50.099 50.099 0 0 0 22.309 41.685l55.581 37.054a50.102 50.102 0 0 1 22.309 41.686v6.587M183.7 584.5v6.587a50.1 50.1 0 0 0 22.31 41.686l55.581 37.054a50.097 50.097 0 0 1 22.309 41.685v6.588M384.101 277.637v6.588a50.1 50.1 0 0 0 22.309 41.685l55.581 37.054a50.1 50.1 0 0 1 22.31 41.686v6.587M384.1 770.288v6.587a50.1 50.1 0 0 1-22.309 41.686l-55.581 37.054A50.099 50.099 0 0 0 283.9 897.3v6.588'
          stroke='#334155'
        />
        <path
          d='M384.1 770.288v6.587a50.1 50.1 0 0 1-22.309 41.686l-55.581 37.054A50.099 50.099 0 0 0 283.9 897.3v6.588M484.3 594.937v6.587a50.1 50.1 0 0 1-22.31 41.686l-55.581 37.054A50.1 50.1 0 0 0 384.1 721.95v6.587M484.3 872.575v6.587a50.1 50.1 0 0 1-22.31 41.686l-55.581 37.054a50.098 50.098 0 0 0-22.309 41.686v6.582M584.501 663.824v39.988a50.099 50.099 0 0 1-22.31 41.685l-55.581 37.054a50.102 50.102 0 0 0-22.309 41.686v6.587M283.899 945.637v6.588a50.1 50.1 0 0 1-22.309 41.685l-55.581 37.05a50.12 50.12 0 0 0-22.31 41.69v6.59M384.1 277.637c0 19.946 12.763 37.655 31.686 43.962l137.028 45.676c18.923 6.308 31.686 24.016 31.686 43.962M183.7 463.425v30.69c0 21.564 13.799 40.709 34.257 47.529l134.457 44.819c18.922 6.307 31.686 24.016 31.686 43.962M83.5 102.288c0 19.515 13.554 36.412 32.604 40.645l235.391 52.309c19.05 4.234 32.605 21.13 32.605 40.646M83.5 463.425v-58.45M183.699 542.75V396.625M283.9 1068.8V945.637M83.5 363.225v-141.95M83.5 179.524v-77.237M83.5 60.537V0M384.1 630.425V277.637M484.301 830.824V594.937M584.5 1068.8V663.825M484.301 555.275V452.988M584.5 622.075V452.988M384.1 728.537v-56.362M384.1 1068.8v-20.88M384.1 1006.17V770.287M283.9 903.888V759.85M183.699 1066.71V891.362M83.5 1068.8V716.012M83.5 674.263V505.175'
          stroke='#334155'
        />
        <circle cx='83.5' cy='384.1' r='10.438' transform='rotate(-180 83.5 384.1)' fill='#1E293B' stroke='#334155' />
        <circle cx='83.5' cy='200.399' r='10.438' transform='rotate(-180 83.5 200.399)' stroke='#334155' />
        <circle cx='83.5' cy='81.412' r='10.438' transform='rotate(-180 83.5 81.412)' stroke='#334155' />
        <circle
          cx='183.699'
          cy='375.75'
          r='10.438'
          transform='rotate(-180 183.699 375.75)'
          fill='#1E293B'
          stroke='#334155'
        />
        <circle
          cx='183.699'
          cy='563.625'
          r='10.438'
          transform='rotate(-180 183.699 563.625)'
          fill='#1E293B'
          stroke='#334155'
        />
        <circle cx='384.1' cy='651.3' r='10.438' transform='rotate(-180 384.1 651.3)' fill='#1E293B' stroke='#334155' />
        <circle
          cx='484.301'
          cy='574.062'
          r='10.438'
          transform='rotate(-180 484.301 574.062)'
          fill='#0EA5E9'
          fillOpacity='.42'
          stroke='#0EA5E9'
        />
        <circle
          cx='384.1'
          cy='749.412'
          r='10.438'
          transform='rotate(-180 384.1 749.412)'
          fill='#1E293B'
          stroke='#334155'
        />
        <circle cx='384.1' cy='1027.05' r='10.438' transform='rotate(-180 384.1 1027.05)' stroke='#334155' />
        <circle cx='283.9' cy='924.763' r='10.438' transform='rotate(-180 283.9 924.763)' stroke='#334155' />
        <circle cx='183.699' cy='870.487' r='10.438' transform='rotate(-180 183.699 870.487)' stroke='#334155' />
        <circle
          cx='283.9'
          cy='738.975'
          r='10.438'
          transform='rotate(-180 283.9 738.975)'
          fill='#1E293B'
          stroke='#334155'
        />
        <circle
          cx='83.5'
          cy='695.138'
          r='10.438'
          transform='rotate(-180 83.5 695.138)'
          fill='#1E293B'
          stroke='#334155'
        />
        <circle
          cx='83.5'
          cy='484.3'
          r='10.438'
          transform='rotate(-180 83.5 484.3)'
          fill='#0EA5E9'
          fillOpacity='.42'
          stroke='#0EA5E9'
        />
        <circle
          cx='484.301'
          cy='432.112'
          r='10.438'
          transform='rotate(-180 484.301 432.112)'
          fill='#1E293B'
          stroke='#334155'
        />
        <circle
          cx='584.5'
          cy='432.112'
          r='10.438'
          transform='rotate(-180 584.5 432.112)'
          fill='#1E293B'
          stroke='#334155'
        />
        <circle
          cx='584.5'
          cy='642.95'
          r='10.438'
          transform='rotate(-180 584.5 642.95)'
          fill='#1E293B'
          stroke='#334155'
        />
        <circle cx='484.301' cy='851.699' r='10.438' transform='rotate(-180 484.301 851.699)' stroke='#334155' />
        <circle cx='384.1' cy='256.763' r='10.438' transform='rotate(-180 384.1 256.763)' stroke='#334155' />
      </g>
    </svg>
  );
}

export function TrafficLightsIcon({ className }: IconProps) {
  return (
    <svg aria-hidden='true' viewBox='0 0 42 10' fill='none' className={className}>
      <circle cx='5' cy='5' r='4.5' />
      <circle cx='21' cy='5' r='4.5' />
      <circle cx='37' cy='5' r='4.5' />
    </svg>
  );
}

export function IpIcon({ className }: IconProps) {
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
      <path d='M18.364 19.364a9 9 0 1 0 -12.728 0'></path>
      <path d='M15.536 16.536a5 5 0 1 0 -7.072 0'></path>
      <path d='M12 13m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0'></path>
    </svg>
  );
}

export function WebsiteIcon({ className }: IconProps) {
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
      <path d='M19.5 7a9 9 0 0 0 -7.5 -4a8.991 8.991 0 0 0 -7.484 4'></path>
      <path d='M11.5 3a16.989 16.989 0 0 0 -1.826 4'></path>
      <path d='M12.5 3a16.989 16.989 0 0 1 1.828 4'></path>
      <path d='M19.5 17a9 9 0 0 1 -7.5 4a8.991 8.991 0 0 1 -7.484 -4'></path>
      <path d='M11.5 21a16.989 16.989 0 0 1 -1.826 -4'></path>
      <path d='M12.5 21a16.989 16.989 0 0 0 1.828 -4'></path>
      <path d='M2 10l1 4l1.5 -4l1.5 4l1 -4'></path>
      <path d='M17 10l1 4l1.5 -4l1.5 4l1 -4'></path>
      <path d='M9.5 10l1 4l1.5 -4l1.5 4l1 -4'></path>
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
