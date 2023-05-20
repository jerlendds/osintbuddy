import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Fragment, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CogIcon,
  DocumentMagnifyingGlassIcon,
  FolderOpenIcon,
  InboxIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { TourProvider } from '@reactour/tour';
import { ViewfinderCircleIcon } from '@heroicons/react/20/solid';
import classNames from 'classnames';
import OSINTBuddyLogo from '@images/logo.svg';
import HamburgerMenu from '@/components/HamburgerMenu';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { isSidebarOpen, setSidebar } from '@/features/settings/settingsSlice';
import IncidentCard from '@/components/IncidentCard';
import { JSONObject } from '@/globals';

const navigation = [
  { name: 'Projects', to: '/app/dashboard', icon: InboxIcon },
  { name: 'Incidents *', to: '/app/incidents', icon: FolderOpenIcon },
  { name: 'Scans *', to: '/app/scans', icon: DocumentMagnifyingGlassIcon },
  { name: 'Dorks', to: '/app/dorking', icon: ViewfinderCircleIcon },
];

const graphTourSteps: any = [
  {
    selector: '#main-view',
    content:
      'Welcome to OSINTBuddy, this is your investigation graph where you can start with one data point and continue mining for more related information',
  },
  {
    selector: '#node-options-tour',
    content:
      'These are entities, the building blocks of an investigation. Try opening the entities panel now, you can drag an entity to the graph to get started. Once you have an entity on the graph you can right click the entity to transform it into new data',
  },
];

export default function AppLayout() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const showSidebar: boolean = useAppSelector((state) => isSidebarOpen(state));
  const [openIncident, setOpenIncident] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const cancelButtonRef = useRef(null);

  const toggleSidebar = () => {
    dispatch(setSidebar(!showSidebar));
  };

  return (
    <>
      <TourProvider
        steps={graphTourSteps}
        onClickClose={({ setCurrentStep, currentStep, steps, setIsOpen }) => setIsOpen(false)}
        padding={{
          mask: 10,
          popover: [5, 10],
          wrapper: 0,
        }}
        prevButton={({ currentStep, setCurrentStep, steps }: JSONObject) => {
          const first = currentStep === 0;
          return (
            <button
              className='flex px-2 py-2 hover:ring-2 focus:ring-1 focus:ring-inset outline-none items-center text-slate-400 hover:text-slate-200 rounded-md ring-1 '
              onClick={() => {
                if (first) {
                  setCurrentStep((s: JSONObject) => steps.length - 1);
                } else {
                  setCurrentStep((s: JSONObject) => s - 1);
                }
              }}
            >
              <ChevronLeftIcon className='w-5 h-5 text-slate-400' />
              <span className='mx-2'> Back</span>
            </button>
          );
        }}
        nextButton={({ Button, currentStep, stepsLength, setIsOpen, setCurrentStep, steps }: JSONObject) => {
          const last = currentStep === stepsLength - 1;
          return (
            <button
              onClick={() => {
                if (last) {
                  setIsOpen(false);
                } else {
                  setCurrentStep((s: JSONObject) => (s === steps?.length - 1 ? 0 : s + 1));
                }
              }}
              className='flex px-2 py-2 hover:ring-2 focus:ring-1 focus:ring-inset outline-none items-center text-slate-400 hover:text-slate-200 rounded-md ring-1 '
            >
              <span className='mx-2'> {last ? 'Next' : null}</span>
              <ChevronRightIcon className='w-5 h-5 text-slate-400' />
            </button>
          );
        }}
        currentStep={currentStep}
        setCurrentStep={() => {
          if (currentStep === graphTourSteps.length - 1) {
            setCurrentStep(0);
          } else {
            setCurrentStep(currentStep + 1);
          }
        }}
        styles={{
          popover: (base) => ({
            ...base,
            '--reactour-accent': '#2181B5',
            'borderRadius': 5,
            'backgroundColor': 'rgb(15 23 42)',
            'color': 'rgb(148 163 184)',
          }),
          maskArea: (base) => ({ ...base, rx: 10 }),
          maskWrapper: (base) => ({ ...base, color: '#0B111F', opacity: 0.8 }),
          badge: (base) => ({ ...base, left: 'auto', right: '-0.8125em' }),
          controls: (base) => ({ ...base, marginTop: 100 }),
          close: (base) => ({ ...base, right: 'auto', left: 8, top: 8 }),
        }}
      >
        <div className='flex flex-col max-w-screen'>
          <div
            className={classNames(
              'fixed inset-y-0 flex border-r border-dark-300 w-64 flex-col transition-transform duration-100',
              showSidebar ? 'translate-x-0' : '-translate-x-52'
            )}
          >
            <div className='flex min-h-0 flex-1 flex-col bg-dark-600'>
              <div
                className={classNames(
                  'flex h-12 flex-shrink-0 items-center justify-between',
                  showSidebar ? 'px-3' : 'px-1'
                )}
              >
                <Link to='/' replace>
                  <img className='h-7 w-auto' src={OSINTBuddyLogo} alt='OSINTBuddy' />
                </Link>

                <HamburgerMenu isOpen={showSidebar} className='mx-1.5' onClick={toggleSidebar} />
              </div>
              <div className='flex flex-1 flex-col overflow-y-auto'>
                <nav className={classNames('flex-1 flex py-4 flex-col')}>
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.to}
                      className={({ isActive }) =>
                        classNames(isActive && 'active', 'sidebar-link', !showSidebar && 'mx-0')
                      }
                    >
                      <item.icon
                        className={classNames(
                          'transition-all',
                          location.pathname.includes(item.to)
                            ? 'text-info-200'
                            : 'text-slate-400 group-hover:text-slate-300',
                          'mr-3 flex-shrink-0 h-6 w-6 duration-100',
                          showSidebar ? 'translate-x-0' : 'translate-x-[13.16rem]'
                        )}
                        aria-hidden='true'
                      />
                      {item.name}{' '}
                      {item.name === 'Incidents *' && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenIncident(!openIncident);
                            toast.info(
                              <>
                                This feature is currently being planned out and created. You can help shape this feature
                                by contributing to the discussion{' '}
                                <a
                                  className='text-info-200'
                                  href='https://github.com/jerlendds/osintbuddy/discussions'
                                  target='_blank'
                                >
                                  on Github!
                                </a>
                              </>,
                              { autoClose: 10000 }
                            );
                          }}
                          title='Create new incident'
                          className='ml-auto relative bg-dark-400 transition-colors duration-75 hover:bg-dark-500 p-1.5 rounded-full'
                        >
                          <PlusIcon className='text-white w-5 h-5' />
                        </button>
                      )}
                    </NavLink>
                  ))}
                  <NavLink
                    to='/app/settings'
                    replace
                    className={({ isActive }) =>
                      classNames(isActive && 'active', 'sidebar-link mt-auto', !showSidebar && 'mx-0')
                    }
                  >
                    <CogIcon
                      className={classNames(
                        'transition-all',
                        location.pathname.includes('settings')
                          ? 'text-info-200'
                          : 'text-slate-400 group-hover:text-slate-300',
                        'mr-3 flex-shrink-0 h-6 w-6 duration-100',
                        showSidebar ? 'translate-x-0' : 'translate-x-[13.16rem]'
                      )}
                      aria-hidden='true'
                    />
                    Settings
                  </NavLink>
                </nav>
              </div>
            </div>
          </div>
          <div
            id='main-view'
            style={{ width: `calc(100% - ${showSidebar ? 16 : 3}rem)` }}
            className={classNames(
              ' w-full transition-all overflow-hidden duration-100 relative ',
              showSidebar ? 'translate-x-64' : 'translate-x-12'
            )}
          >
            <main className='flex-1 block h-screen relative w-full'>
              <Outlet />{' '}
            </main>
          </div>
        </div>
        <Transition.Root show={openIncident} as={Fragment}>
          <Dialog as='div' className='relative z-10' initialFocus={cancelButtonRef} onClose={setOpenIncident}>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-dark-900 bg-opacity-75 transition-opacity' />
            </Transition.Child>

            <div className='fixed inset-0 z-10 overflow-y-auto'>
              <div className='flex min-h-full items-end justify-center text-center sm:items-center sm:p-0 '>
                <Transition.Child
                  as={Fragment}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                  enterTo='opacity-100 translate-y-0 sm:scale-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                  leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                >
                  <Dialog.Panel className='relative max-w-4xl z-10 w-full transform overflow-hidden rounded-lg  text-left shadow-xl transition-all '>
                    <IncidentCard closeModal={() => setOpenIncident(false)} />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <ToastContainer
          position='bottom-left'
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme='light'
          toastStyle={{
            backgroundColor: 'rgb(23 35 65)',
            color: 'rgb(148, 163, 184)',
          }}
        />
      </TourProvider>
    </>
  );
}
