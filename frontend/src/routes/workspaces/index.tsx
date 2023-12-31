import { InquiryHeader } from '@src/components/Headers';
import classNames from 'classnames';
import { Fragment, useEffect, useRef, useState } from 'react';
import { Combobox } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import {
  ExclamationCircleIcon,
  PencilSquareIcon,
  ListBulletIcon,
  Squares2X2Icon,
  MapIcon,
  InboxIcon,
  ChevronUpDownIcon,
  XMarkIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { UnderConstruction } from '@src/components/Loaders';

const items = [
  {
    id: 1,
    name: 'Text',
    description: 'Add freeform text with basic formatting options.',
    url: '#',
    color: 'bg-indigo-500',
    icon: PencilSquareIcon,
  },
  // More items...
];

export function SearchBar() {
  const [incidentQuery, setIncidentQuery] = useState('');
  const [incidentOptions, setIncidentOptions] = useState<any>(items);
  const [projectQuery, setProjectQuery] = useState('');
  const [projectOptions, setProjectOptions] = useState<any>(items);

  const [viewMode, setViewMode] = useState<string>('list');
  const filteredProjects =
    projectQuery === ''
      ? []
      : projectOptions.filter((item: JSONObject) => {
        return item.name.toLowerCase().includes(incidentQuery.toLowerCase());
      });
  const filteredIncidents =
    incidentQuery === ''
      ? []
      : incidentOptions.filter((item: JSONObject) => {
        return item.name.toLowerCase().includes(incidentQuery.toLowerCase());
      });

  return (
    <>
      <div className='flex items-start  w-full pl-6 my-3'>
        <div className='h-12 flex items-center  flex-col bg-mirage-700 mr-2'>
          <fieldset className='isolate inline-flex shadow-sm '>
            <button
              onClick={() => setViewMode('list')}
              type='button'
              className={classNames(
                'relative py-3 inline-flex items-center rounded-l-md outline-none hover:ring-2 px-3 text-slate-400 ring-1 ring-primary-400 focus:bg-dark-800 ring-inset hover:bg-dark-600 focus:z-10 ring-dark-300',
                viewMode === 'list' && 'bg-dark-900'
              )}
            >
              <span className='sr-only'>List view</span>
              <ListBulletIcon
                className={classNames('h-6 w-6', viewMode === 'list' && 'text-primary-100')}
                aria-hidden='true'
              />
            </button>
            <button
              onClick={() => setViewMode('map')}
              type='button'
              className={classNames(
                'relative py-3 inline-flex items-center outline-none hover:ring-2 px-3 text-slate-400 ring-1 focus:bg-dark-800 ring-primary-400 ring-inset hover:bg-dark-600 focus:z-10 ring-dark-300',
                viewMode === 'map' && 'bg-dark-900'
              )}
            >
              <span className='sr-only'>List view</span>
              <MapIcon className={classNames('h-6 w-6', viewMode === 'map' && 'text-primary-100')} aria-hidden='true' />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              type='button'
              className={classNames(
                'relative py-3 inline-flex items-center rounded-r-md  outline-none hover:ring-2 px-3 text-slate-400 ring-1 ring-primary-400 focus:bg-dark-800 ring-inset hover:bg-dark-600 focus:z-10 ring-dark-300',
                viewMode === 'grid' && 'bg-dark-900'
              )}
            >
              <span className='sr-only'>List view</span>
              <Squares2X2Icon
                className={classNames('h-6 w-6', viewMode === 'grid' && 'text-primary-100')}
                aria-hidden='true'
              />
            </button>
          </fieldset>
        </div>
        <Combobox as='div' className='flex flex-col' onChange={(item: JSONObject) => (window.location = item.url)}>
          <div className='relative bg-dark-700 flex items-center mr-px'>
            <InboxIcon
              className='pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-500'
              aria-hidden='true'
            />
            <Combobox.Input
              className='h-12 w-72 rounded-l-md focus:bg-dark-900 ring-dark-300 outline-none ring-1 transition-colors duration-150 ease-in-out bg-transparent pl-11 pr-4 text-slate-200 placeholder:text-slate-500 focus:ring-dark-100 sm:text-sm'
              placeholder='Select a project'
              onChange={(event) => setProjectQuery(event.target.value)}
              onBlur={() => setProjectQuery('')}
            />
            <ChevronUpDownIcon className='pointer-events-none absolute right-2 top-3.5 h-5 w-5 text-slate-500' />
          </div>

          {filteredProjects.find((p: JSONObject) => p.name !== '') &&
            filteredProjects.length > 0 &&
            projectQuery !== '' && (
              <Combobox.Options
                key={projectQuery}
                static
                className='max-h-96 rounded-b-md flex top-[6.3rem] z-20 flex-col absolute w-72 bg-dark-800 scroll-py-3 overflow-y-auto '
              >
                {projectQuery !== '' && (
                  <Combobox.Option
                    value={{ name: projectQuery }}
                    onClick={(e: any) => {
                      e.preventDefault();
                      // @todo open project create dialog
                    }}
                    className={({ active }) =>
                      classNames(
                        'flex items-center rounded-md cursor-default select-none py-1 px-2',
                        active && 'bg-dark-900'
                      )
                    }
                    onBlur={() => setProjectQuery('')}
                  >
                    {({ active }) => (
                      <>
                        <div className={classNames('flex h-10 w-10 flex-none items-center justify-center rounded-lg')}>
                          <PlusIcon className='h-6 w-6 text-white' aria-hidden='true' />
                        </div>
                        <div className='ml-4 flex-auto'>
                          <p
                            className={classNames('text-sm font-medium', active ? 'text-slate-200' : 'text-slate-400')}
                          >
                            Create project '{projectQuery}'
                          </p>
                        </div>
                      </>
                    )}
                  </Combobox.Option>
                )}
                {filteredProjects.map((item: JSONObject) => (
                  <>
                    <Combobox.Option
                      key={item.id}
                      value={item}
                      onClick={(e: any) => {
                        e.preventDefault();
                        // @todo open project create dialog
                      }}
                      className={({ active }) =>
                        classNames(
                          'flex items-center rounded-md cursor-default select-none py-1 px-2',
                          active && 'bg-dark-900'
                        )
                      }
                      onBlur={() => setProjectQuery('')}
                    >
                      {({ active }) => (
                        <>
                          <div
                            className={classNames('flex h-10 w-10 flex-none items-center justify-center rounded-lg')}
                          >
                            <PlusIcon className='h-6 w-6 text-white' aria-hidden='true' />
                          </div>
                          <div className='ml-4 flex-auto'>
                            <p
                              className={classNames(
                                'text-sm font-medium',
                                active ? 'text-slate-200' : 'text-slate-400'
                              )}
                            >
                              {item.name}
                            </p>
                          </div>
                        </>
                      )}
                    </Combobox.Option>
                  </>
                ))}
              </Combobox.Options>
            )}
        </Combobox>
        <Combobox onChange={(item: JSONObject) => (window.location = item.url)}>
          <div className='relative bg-dark-700 flex items-center mr-6 w-full'>
            <MagnifyingGlassIcon
              className='pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-slate-500'
              aria-hidden='true'
            />
            <Combobox.Input
              className='h-12 w-full rounded-r-md focus:bg-dark-900 ring-dark-300 outline-none ring-1 transition-colors duration-150 ease-in-out bg-transparent pl-11 pr-4 text-slate-200 placeholder:text-slate-500 focus:ring-dark-100 sm:text-sm'
              placeholder='Search workspaces...'
              onChange={(event) => setIncidentQuery(event.target.value)}
            />
            <XMarkIcon className='pointer-events-none absolute right-2 top-3.5 h-5 w-5 text-slate-500' />
          </div>

          {filteredIncidents.length > 0 && (
            <Combobox.Options static className='max-h-96 scroll-py-3 overflow-y-auto p-3'>
              {filteredIncidents.map((item: JSONObject) => (
                <Combobox.Option
                  key={item.id}
                  value={item}
                  className={({ active }: JSONObject) =>
                    classNames('flex cursor-default select-none rounded-xl p-3', active && 'bg-gray-100')
                  }
                >
                  {({ active }) => (
                    <>
                      <div
                        className={classNames(
                          'flex h-10 w-10 flex-none items-center justify-center rounded-lg',
                          item.color
                        )}
                      >
                        <item.icon className='h-6 w-6 text-white' aria-hidden='true' />
                      </div>
                      <div className='ml-4 flex-auto'>
                        <p className={classNames('text-sm font-medium', active ? 'text-gray-900' : 'text-gray-700')}>
                          {item.name}
                        </p>
                        <p className={classNames('text-sm', active ? 'text-gray-700' : 'text-gray-500')}>
                          {item.description}
                        </p>
                      </div>
                    </>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </Combobox>
      </div>
      {incidentQuery !== '' && filteredProjects.length === 0 && (
        <div className='px-6 py-14 text-center text-sm sm:px-14 bg-dark-600 flex flex-col mx-6'>
          <ExclamationCircleIcon type='outline' name='exclamation-circle' className='mx-auto h-6 w-6 text-slate-500' />
          <p className='mt-4 font-semibold text-gray-900'>No results found</p>
          <p className='mt-2 text-gray-500'>No components found for this search term. Please try again.</p>
        </div>
      )}
    </>
  );
}


export default function IncidentsPage() {
  return (
    <>
      {/* <InquiryHeader title='Incidents' /> */}
      {/* <SearchBar /> */}
      <UnderConstruction
        header='OSINTBuddy Workspaces'
        description='This feature is currently being planned out and created and will be finished eventually. 
            You can help shape this feature by creating/contributing to a discussion on Github!'
      />
    </>
  );
}
