import { api } from '@/services';
import {
  ArrowDownOnSquareIcon,
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';
// import { IconRefresh } from '@tabler/icons-react';
import classNames from 'classnames';
import { update } from 'lodash';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function BreadcrumbHeader({ activeProject, onLayout, description, updateNodeOptions }: {  description?: string, activeProject: string; onLayout: any, updateNodeOptions: Function }) {
  const pages = [
    { name: 'Investigations', href: '#', current: false },
    { name: activeProject, href: '#', current: true },
  ];

  return (
    <nav
      className='flex justify-between fixed top-0 z-40 border-b border-dark-300 bg-dark-700 w-full '
      aria-label='Breadcrumb'
    >
      <ol role='list' className='flex relative w-full space-x-4 px-4 sm:px-6 lg:px-4'>
        <li className='flex'>
          <div className='flex items-center'>
            <Link title='View all investigations' to='/app/dashboard' replace className='text-slate-400 hover:text-slate-300'>
              <HomeIcon className='h-5 w-5 flex-shrink-0' aria-hidden='true' />
              <span className='sr-only'>Home</span>
            </Link>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name} className='flex'>
            <div
              className={classNames(
                'flex items-center text-slate-400',
                page.name === 'Investigations' ? 'hover:text-slate-400' : 'hover:text-slate-300'
              )}
            >
              <svg
                className='h-full w-6 flex-shrink-0 text-slate-700'
                viewBox='0 0 24 44'
                preserveAspectRatio='none'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path d='M.293 0l22 22-22 22h1.414l22-22-22-22H.293z' />
              </svg>
              <button
                className={classNames(
                  'ml-4 text-sm font-medium text-inherit whitespace-nowrap',
                  page.name === 'Investigations' && 'cursor-default'
                )}
                title={description && page.name !== 'Investigations' ? description : ''}
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </button>
            </div>
          </li>
        ))}
        <div className='ml-auto w-full relative flex items-center justify-end'>
           <li className='flex'>
            <div className='flex items-center'>
              <button onClick={() => updateNodeOptions()} className='text-slate-400 hover:text-slate-300'>
                <i className='h-5 w-5 flex-shrink-0' aria-hidden='true' />
                <span className='sr-only'>Home</span>
              </button>
            </div>
          </li>
          <li className='flex'>
            <div className='flex items-center'>
              <button onClick={() => onLayout('TB')} className='text-slate-400 hover:text-slate-300'>
                <ArrowDownOnSquareIcon className='h-5 w-5 flex-shrink-0' aria-hidden='true' />
                <span className='sr-only'>Home</span>
              </button>
            </div>
          </li>
          <li className='flex'>
            <div className='flex items-center'>
              <button onClick={() => onLayout('LR')} className='text-slate-400  hover:text-slate-300'>
                <ArrowDownOnSquareIcon className='h-5 w-5 origin-center -rotate-90 flex-shrink-0' aria-hidden='true' />
                <span className='sr-only'>Home</span>
              </button>
            </div>
          </li>
        </div>
      </ol>
    </nav>
  );
}
