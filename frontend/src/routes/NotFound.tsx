import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { Bars4Icon, BookmarkSquareIcon, BookOpenIcon, RssIcon } from '@heroicons/react/24/outline';
import OSINTBuddyLogo from '@src/assets/images/logo.svg';
import { Link } from 'react-router-dom';

const links = [
  { title: 'Documentation', href: 'https://osintbuddy.com', description: 'Learn about OSINTBuddy', icon: BookOpenIcon },
  { title: 'Architecture guide', href: 'https://osintbuddy.com/docs/architecture-guide', description: 'Overview of the OSINTBuddy architecture', icon: BookmarkSquareIcon },
];

const social = [
  {
    name: 'GitHub',
    href: 'https://github.com/jerlendds/osintbuddy',
    icon: (props: any) => (
      <svg fill='currentColor' viewBox='0 0 24 24' {...props}>
        <path
          fillRule='evenodd'
          d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
          clipRule='evenodd'
        />
      </svg>
    ),
  },
];

export default function NotFound() {
  return (
    <div className='bg-dark-400'>
      <main className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='flex-shrink-0 pt-16'>
          <img className='mx-auto h-12 w-auto' src={OSINTBuddyLogo} alt='OSINTBuddy' />
        </div>
        <div className='mx-auto max-w-xl py-16 sm:py-24'>
          <div className='text-center'>
            <p className='text-base font-semibold text-info-100'>404</p>
            <h1 className='mt-2 text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl'>
              This page does not exist.
            </h1>
            <p className='mt-2 text-lg text-slate-400'>The page you are looking for could not be found.</p>
          </div>
          <div className='mt-12'>
            <h2 className='text-base font-semibold text-slate-400'>Popular pages</h2>
            <ul role='list' className='mt-4 divide-y divide-dark-100 border-t border-b border-dark-100'>
              {links.map((link, linkIdx) => (
                <li key={linkIdx} className='relative flex items-start space-x-4 py-6'>
                  <div className='flex-shrink-0'>
                    <span className='flex h-12 w-12 items-center justify-center rounded-lg bg-slate-900'>
                      <link.icon className='h-6 w-6 text-info-100' aria-hidden='true' />
                    </span>
                  </div>
                  <div className='min-w-0 flex-1'>
                    <h3 className='text-base font-medium text-slate-200'>
                      <span className='rounded-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2'>
                        <a href={link.href} target='_blank' rel='noreferrer' className='focus:outline-none'>
                          <span className='absolute inset-0' aria-hidden='true' />
                          {link.title}
                        </a>
                      </span>
                    </h3>
                    <p className='text-base text-slate-400'>{link.description}</p>
                  </div>
                  <div className='flex-shrink-0 self-center'>
                    <ChevronRightIcon className='h-5 w-5 text-slate-400' aria-hidden='true' />
                  </div>
                </li>
              ))}
            </ul>
            <div className='mt-8'>
              <Link to='/' replace className='text-base font-medium text-info-100 hover:text-info-200'>
                Or go back home
                <span aria-hidden='true'> &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className='mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='border-t border-dark-100 py-12 text-center md:flex md:justify-between'>
          <p className='text-base text-slate-400'>&copy; OSINTBuddy. All rights reserved.</p>
          <div className='mt-6 flex justify-center space-x-8 md:mt-0'>
            {social.map((item, itemIdx) => (
              <a key={itemIdx} href={item.href} className='inline-flex text-slate-400 hover:text-slate-500'>
                <span className='sr-only'>{item.name}</span>
                <item.icon className='h-6 w-6' aria-hidden='true' />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
