import { NavLink, Outlet, useLocation } from 'react-router-dom';

import { Fragment, useState } from 'react';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  Bars3BottomLeftIcon,
  BellIcon,
  CalendarIcon,
  ChartBarIcon,
  FolderIcon,
  HomeIcon,
  InboxIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import OSINTBuddyLogo from '@images/logo-dark.svg';
import HamburgerMenu from '@/components/HamburgerMenu';
import { GoogleIcon, ShellIcon } from '@/components/Icons';

const navigation = [
  { name: 'Dashboard', to: '/app/dashboard', icon: HomeIcon },
  { name: 'Dorking', to: '/app/dorking', icon: GoogleIcon },
  { name: 'Live shell', to: '/app/shell', icon: ShellIcon },
];

export default function AppLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  console.log(sidebarOpen);

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog as='div' className='relative z-40 md:hidden' onClose={() => null}>
            <Transition.Child
              as={Fragment}
              enter='transition-opacity ease-linear duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='transition-opacity ease-linear duration-300'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-dark-600 bg-opacity-75' />
            </Transition.Child>

            <div className='fixed inset-0 z-40 flex'>
              <Transition.Child
                as={Fragment}
                enter='transition ease-in-out duration-300 transform'
                enterFrom='-translate-x-full'
                enterTo='translate-x-0'
                leave='transition ease-in-out duration-300 transform'
                leaveFrom='translate-x-0'
                leaveTo='-translate-x-full'
              >
                <Dialog.Panel className='relative flex w-full max-w-xs flex-1 flex-col bg-dark-800 pt-5 pb-4'>
                  <Transition.Child
                    as={Fragment}
                    enter='ease-in-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in-out duration-300'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'
                  >
                    <div className='absolute top-0 right-0 -mr-12 pt-2'>
                      <button
                        type='button'
                        className='ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className='sr-only'>Close sidebar</span>
                        <XMarkIcon className='h-6 w-6 text-white' aria-hidden='true' />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className='flex flex-shrink-0 items-center px-4'>
                    <img className='h-8 w-auto' src={OSINTBuddyLogo} alt='Your Company' />
                  </div>
                  <div className='mt-5 h-0 flex-1 overflow-y-auto'>
                    <nav className='space-y-1 px-2'>
                      {navigation.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.to}
                          className={({ isActive }) =>
                            classNames(
                              isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                            )
                          }
                        >
                          <item.icon
                            className={classNames(
                              'text-gray-400 group-hover:text-gray-300',
                              'mr-4 flex-shrink-0 h-6 w-6'
                            )}
                            aria-hidden='true'
                          />
                          {item.name}
                        </NavLink>
                      ))}
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
              <div className='w-14 flex-shrink-0 z-0' aria-hidden='true'>
                {/* Dummy element to force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div
          className={classNames(
            'hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col transition-transform duration-200',
            sidebarOpen ? 'translate-x-0' : '-translate-x-52'
          )}
        >
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className='flex min-h-0 flex-1 flex-col bg-dark-800 px-1.5'>
            <div
              className={classNames(
                'flex h-12 flex-shrink-0 items-center bg-dark-800 justify-between',
                sidebarOpen ? 'px-3' : 'px-1'
              )}
            >
              <img className='h-7 w-auto' src={OSINTBuddyLogo} alt='Your Company' />
              <p className='text-light-200 text-2xl -ml-8 my-auto font-display'>SINTBuddy</p>
              <HamburgerMenu isOpen={sidebarOpen} onClick={toggleSidebar} />
            </div>

            <div className='flex flex-1 flex-col overflow-y-auto'>
              <nav className={classNames('flex-1 py-4 ')}>
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    className={({ isActive }) =>
                      classNames(
                        isActive
                          ? 'bg-dark-500 text-light-400'
                          : 'text-dark-200 duration-200 hover:bg-dark-700 hover:text-light-400',
                        'group flex items-center px-2 py-2 text-base font-sans font-medium rounded-r-sm'
                      )
                    }
                  >
                    <item.icon
                      className={classNames(
                        location.pathname === item.to ? 'text-primary' : 'text-gray-400 group-hover:text-gray-300',
                        'mr-3 flex-shrink-0 h-6 w-6 transition-transform duration-200',
                        sidebarOpen ? 'translate-x-0' : 'translate-x-[12.7rem]'
                      )}
                      aria-hidden='true'
                    />
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>
        <div className={classNames('flex flex-col', sidebarOpen ? 'md:pl-64' : 'md:pl-11')}>
          <button
            type='button'
            className='border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden'
            onClick={() => setSidebarOpen(true)}
          >
            <span className='sr-only'>Open sidebar</span>
            <Bars3BottomLeftIcon className='h-6 w-6' aria-hidden='true' />
          </button>

          <main className='flex-1 block h-full overflow-y-scroll'>
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}
