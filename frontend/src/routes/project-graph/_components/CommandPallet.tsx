import { Fragment, useState } from 'react';
import { Combobox, Dialog, Transition } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { DocumentPlusIcon, FolderPlusIcon, FolderIcon, HashtagIcon, TagIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
const projects = [{ id: 1, name: 'Workflow Inc. / Website Redesign', url: '#' }];
const recent = [projects[0]];
const quickActions = [
  { name: 'Add new file...', icon: DocumentPlusIcon, shortcut: 'N', url: '#' },
  { name: 'Add new folder...', icon: FolderPlusIcon, shortcut: 'F', url: '#' },
  { name: 'Add node...', icon: HashtagIcon, shortcut: 'H', url: '#' },
  { name: 'Add label...', icon: TagIcon, shortcut: 'L', url: '#' },
];

export default function CommandPallet({
  isOpen,
  setOpen,
}: {
  isOpen: boolean;
  setOpen: Function;

}) {
  const [query, setQuery] = useState('');

  const filteredProjects =
    query === ''
      ? []
      : projects.filter((project) => {
          return project.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Transition.Root show={isOpen} as={Fragment} afterLeave={() => setQuery('')}>
      <Dialog as='div' className='relative z-10' onClose={() => setOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20'>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0 scale-95'
            enterTo='opacity-100 scale-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100 scale-100'
            leaveTo='opacity-0 scale-95'
          >
            <Dialog.Panel className='mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all'>
              <Combobox onChange={(item: any) => (window.location = item.url)}>
                <div className='relative'>
                  <MagnifyingGlassIcon
                    className='pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400'
                    aria-hidden='true'
                  />
                  <Combobox.Input
                    className='h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm'
                    placeholder='Search...'
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                {(query === '' || filteredProjects.length > 0) && (
                  <Combobox.Options static className='max-h-80 scroll-py-2 divide-y divide-gray-100 overflow-y-auto'>
                    <li className='p-2'>
                      {query === '' && (
                        <h2 className='mt-4 mb-2 px-3 text-xs font-semibold text-gray-500'>Recent searches</h2>
                      )}
                      <ul className='text-sm text-gray-700'>
                        {(query === '' ? recent : filteredProjects).map((project) => (
                          <Combobox.Option
                            key={project.id}
                            value={project}
                            className={({ active }) =>
                              classNames(
                                'flex cursor-default select-none items-center rounded-md px-3 py-2',
                                active && 'bg-primary-600 text-white'
                              )
                            }
                          >
                            {({ active }) => (
                              <>
                                <FolderIcon
                                  className={classNames('h-6 w-6 flex-none', active ? 'text-white' : 'text-gray-400')}
                                  aria-hidden='true'
                                />
                                <span className='ml-3 flex-auto truncate'>{project.name}</span>
                                {active && <span className='ml-3 flex-none text-primary-100'>Jump to...</span>}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </ul>
                    </li>
                    {query === '' && (
                      <li className='p-2'>
                        <h2 className='sr-only'>Quick actions</h2>
                        <ul className='text-sm text-gray-700'>
                          {quickActions.map((action) => (
                            <Combobox.Option
                              key={action.shortcut}
                              value={action}
                              className={({ active }) =>
                                classNames(
                                  'flex cursor-default select-none items-center rounded-md px-3 py-2',
                                  active && 'bg-primary-600 text-white'
                                )
                              }
                            >
                              {({ active }) => (
                                <>
                                  <action.icon
                                    className={classNames('h-6 w-6 flex-none', active ? 'text-white' : 'text-gray-400')}
                                    aria-hidden='true'
                                  />
                                  <span className='ml-3 flex-auto truncate'>{action.name}</span>
                                  <span
                                    className={classNames(
                                      'ml-3 flex-none text-xs font-semibold',
                                      active ? 'text-primary-100' : 'text-gray-400'
                                    )}
                                  >
                                    <kbd className='font-sans'>⌘</kbd>
                                    <kbd className='font-sans'>{action.shortcut}</kbd>
                                  </span>
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                        </ul>
                      </li>
                    )}
                  </Combobox.Options>
                )}

                {query !== '' && filteredProjects.length === 0 && (
                  <div className='py-14 px-6 text-center sm:px-14'>
                    <FolderIcon className='mx-auto h-6 w-6 text-gray-400' aria-hidden='true' />
                    <p className='mt-4 text-sm text-gray-900'>
                      We couldn't find any projects with that term. Please try again.
                    </p>
                  </div>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
