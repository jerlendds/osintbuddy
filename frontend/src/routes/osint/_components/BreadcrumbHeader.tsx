import { HomeIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function BreadcrumbHeader({ activeProject }: { activeProject: string }) {
  const pages = [
    { name: 'Investigations', href: '#', current: false },
    { name: activeProject, href: '#', current: true },
  ];
  return (
    <nav
      className='flex justify-between fixed top-0 z-40 border-b border-dark-300 bg-dark-700 w-full'
      aria-label='Breadcrumb'
    >
      <ol role='list' className='flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8'>
        <li className='flex'>
          <div className='flex items-center'>
            <Link to='/app/dashboard' replace className='text-gray-400 hover:text-light-500'>
              <HomeIcon className='h-5 w-5 flex-shrink-0' aria-hidden='true' />
              <span className='sr-only'>Home</span>
            </Link>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name} className='flex'>
            <div className='flex items-center'>
              <svg
                className='h-full w-6 flex-shrink-0 text-gray-300'
                viewBox='0 0 24 44'
                preserveAspectRatio='none'
                fill='currentColor'
                xmlns='http://www.w3.org/2000/svg'
                aria-hidden='true'
              >
                <path d='M.293 0l22 22-22 22h1.414l22-22-22-22H.293z' />
              </svg>
              <button
                className='ml-4 text-sm font-medium text-light-500 hover:text-light-700'
                aria-current={page.current ? 'page' : undefined}
              >
                {page.name}
              </button>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}