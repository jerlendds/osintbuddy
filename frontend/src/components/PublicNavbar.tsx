import { NavLink, useLocation } from 'react-router-dom';
import { Fragment } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import OSINTBuddyLogo from '@assets/images/logo.svg';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Docs', href: '/about' },
  // { name: 'Sign up', href: '/sign-up' },
  { name: 'Sign in', href: '/sign-in' },
];

export default function PublicNavbar(): React.ReactElement {
  const location = useLocation();

  return (
    <Disclosure as='nav' className='bg-light-400 '>
      {({ open }: { open: boolean }) => (
        <>
          <div className='mx-auto  px-2 sm:px-6 lg:px-24 '>
            <div className='relative flex h-12 items-center justify-between'>
              <div className='absolute inset-y-0 left-0 flex items-center sm:hidden z-50'>
                {/* Mobile menu button*/}
                <Disclosure.Button className='inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none'>
                  <span className='sr-only'>Open main menu</span>
                  <div className={classNames('hamburger', !open || 'is-active')}>
                    <div className='line' />
                    <div className='line' />
                    <div className='line' />
                  </div>
                </Disclosure.Button>
              </div>
              <div className='flex flex-1 items-center justify-center sm:items-stretch sm:justify-start'>
                <div className='flex flex-shrink-0 items-center'>
                  <img className='block h-7 w-auto lg:hidden' src={OSINTBuddyLogo} alt='Your Company' />
                  <div className='flex'>
                    <img className='hidden h-7 w-auto lg:block' src={OSINTBuddyLogo} alt='Your Company' />
                    <p className='text-dark-900 text-2xl ml-0.5 my-auto font-display'>SINTBuddy</p>
                  </div>
                </div>
                <div className='hidden sm:ml-6 w-full my-auto justify-end sm:flex'>
                  <div className='flex space-x-10 '>
                    {navigation.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.href}
                        replace
                        className={classNames(
                          'lowercase',
                          item.href === location.pathname
                            ? 'text-dark-500 after:px-auto inline-block after:content-[""]  after:block after:h-0.5 after:bg-primary after:transition-all'
                            : 'text-dark-800 '
                        )}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Transition
            enter='transition duration-100 absolute ease-out'
            enterFrom='transform scale-95 absolute opacity-0'
            enterTo='transform scale-100 absolute opacity-100'
            leave='transition duration-75 absolute ease-out'
            leaveFrom='transform translate-x-0 absolute opacity-100'
            leaveTo='transform scale-95 -translate-x-40 absolute '
          >
            <Disclosure.Panel className={classNames('sm:hidden z-50 ', open ? '-translate-x-0' : '-translate-x-96')}>
              <div className='flex flex-col items-start  space-y-4 px-2 pt-2 pb-3 '>
                {navigation.map((item) => (
                  <Disclosure.Button key={item.name} as='button'>
                    <NavLink
                      key={item.name}
                      to={item.href}
                      replace
                      className={classNames(
                        item.href === location.pathname
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'px-3 py-2 rounded-md text-sm font-medium'
                      )}
                    >
                      {item.name}
                    </NavLink>
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
