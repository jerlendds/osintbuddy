import { Fragment, useEffect, useState } from 'react';
import { Combobox, Switch, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';

export default function IncidentCard({ closeModal }: JSONObject) {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]);
  const [activeOption, setActiveOption] = useState(null);
  const [tags, setTags] = useState<any>([]);
  const [enabled, setEnabled] = useState(false);
  const filteredOptions =
    query === ''
      ? options ?? []
      : options?.filter((option: any) => {
        return option.label.toLowerCase().includes(query.toLowerCase());
      }) ?? [];


  return (
    <div className='bg-dark-600 w-full  shadow sm:rounded-lg'>
      <div className='border-b border-dark-300 mx-4 py-5 sm:px-6'>
        <div className='-ml-6 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap'>
          <div className='ml-4 mt-2'>
            <h1 className='font-display text-2xl tracking-tight text-slate-200 dark:text-white'>New Incident</h1>
          </div>
        </div>
      </div>
      <div className='sm:col-span-2'>
        <Combobox className='w-full z-50 px-8' as='div' value={activeOption} onChange={setActiveOption}>
          <Combobox.Label>
            <p className='block font-semibold leading-6 mt-4 text-slate-200 '>Project</p>
          </Combobox.Label>
          <div className='relative mt-1'>
            <Combobox.Input
              className='px-3 block w-full bg-dark-800  rounded-md border-0 py-2 text-slate-100 shadow-sm ring-1 placeholder:text-gray-400 focus:ring-1 focus:ring-inset outline-none focus:ring-info-200 sm:text-sm sm:leading-6'
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(option: JSONObject) => option?.name}
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
              <ChevronUpDownIcon className='h-5 w-5 text-slate-400' aria-hidden='true' />
            </Combobox.Button>

            {filteredOptions.length > 0 && (
              <Combobox.Options className='absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-b-md bg-dark-800 py-1 text-base shadow-2xl ring-1 ring-gray-200 ring-opacity-5 focus:outline-none sm:text-sm'>
                {filteredOptions.map((option: JSONObject) => (
                  <Combobox.Option
                    key={option.id}
                    value={option}
                    title={option.description !== option.name ? option.description : 'No description found'}
                    className={({ active }) =>
                      classNames(
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        active ? 'bg-slate-900 text-slate-300' : 'text-slate-400'
                      )
                    }
                  >
                    {({ active, selected }) => (
                      <span className={classNames('block truncate pl-2')}>{option?.name && option.name}</span>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}
          </div>
        </Combobox>
      </div>
      <div className='sm:col-span-2'>
        <label htmlFor='message' className='block font-semibold leading-6 mt-4 text-slate-200 pl-8'>
          Short description
        </label>
        <div className='mt-2.5 px-8'>
          <textarea
            name='message'
            id='message'
            rows={2}
            className='block w-full bg-dark-800  rounded-md border-0 px-3.5 py-2 text-slate-100 shadow-sm ring-1 placeholder:text-gray-400 focus:ring-1 focus:ring-inset outline-none focus:ring-info-200 sm:text-sm sm:leading-6'
            defaultValue={''}
          />
        </div>
      </div>
      <div className='sm:col-span-2'>
        <label htmlFor='message' className='block font-semibold leading-6 mt-4 text-slate-200 pl-8'>
          Source material
        </label>
        <div className='mt-2.5 px-8 flex justify-between items-center'>
          <input
            name='message'
            id='message'
            className='block w-full bg-dark-800  rounded-md border-0 px-3.5 py-2 text-slate-100 shadow-sm ring-1 placeholder:text-gray-400 focus:ring-1 focus:ring-inset outline-none focus:ring-info-200 sm:text-sm sm:leading-6 mr-3'
            defaultValue={''}
          />
          <button className='flex px-2 py-2 hover:ring-2 focus:ring-1 focus:ring-inset outline-none items-center text-white rounded-md ring-1 '>
            <span className='mx-2'>Add</span>
            <PlusIcon className='w-5 h-5 text-white' />
          </button>
        </div>
        <p className='block leading-6 mt-1 text-sm text-slate-400 pl-8'>
          OSINTBuddy will attempt to archive these URLs automatically
        </p>
      </div>
      <div className='sm:col-span-2 flex items-center'>
        <Combobox className='w-full z-50 px-8' as='div' value={activeOption} onChange={setActiveOption}>
          <Combobox.Label>
            <p className='block font-semibold leading-6 mt-4 text-slate-200 '>Incident Type</p>
          </Combobox.Label>
          <div className='relative mt-1'>
            <Combobox.Input
              className='px-3 block w-full bg-dark-800  rounded-md border-0 py-2 text-slate-100 shadow-sm ring-1 placeholder:text-gray-400 focus:ring-1 focus:ring-inset outline-none focus:ring-info-200 sm:text-sm sm:leading-6'
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(option: JSONObject) => option?.label}
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
              <ChevronUpDownIcon className='h-5 w-5 text-slate-400' aria-hidden='true' />
            </Combobox.Button>

            {filteredOptions.length > 0 && (
              <Combobox.Options className='absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-b-md bg-dark-400 py-1 text-base shadow-lg ring-1 ring-gray-200 ring-opacity-5 focus:outline-none sm:text-sm'>
                {filteredOptions.map((option: JSONObject) => (
                  <Combobox.Option
                    key={option.id}
                    value={option}
                    className={({ active }) =>
                      classNames(
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        active ? 'bg-slate-900 text-slate-300' : 'text-slate-400'
                      )
                    }
                  >
                    {({ active, selected }) => (
                      <span
                        className={classNames('block truncate pl-2')}
                        title={option?.tooltip !== option.label ? option.tooltip : 'No description found'}
                      >
                        {option?.label && option.label}
                      </span>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}
          </div>
        </Combobox>
        <Combobox className='z-50 w-96 pr-8' as='div' value={activeOption} onChange={setActiveOption}>
          <Combobox.Label>
            <p className='block font-semibold leading-6 mt-4 text-slate-200 '>Sensitivity</p>
          </Combobox.Label>
          <div className='relative mt-1'>
            <Combobox.Input
              className='px-3 block w-full bg-dark-800  rounded-md border-0 py-2 text-slate-100 shadow-sm ring-1 placeholder:text-gray-400 focus:ring-1 focus:ring-inset outline-none focus:ring-info-200 sm:text-sm sm:leading-6'
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(option: JSONObject) => option?.label}
            />
            <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
              <ChevronUpDownIcon className='h-5 w-5 text-slate-400' aria-hidden='true' />
            </Combobox.Button>

            {filteredOptions.length > 0 && (
              <Combobox.Options className='absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-b-md bg-dark-400 py-1 text-base shadow-lg ring-1 ring-gray-200 ring-opacity-5 focus:outline-none sm:text-sm'>
                {filteredOptions.map((option: JSONObject) => (
                  <Combobox.Option
                    key={option.id}
                    value={option}
                    className={({ active }) =>
                      classNames(
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        active ? 'bg-slate-900 text-slate-300' : 'text-slate-400'
                      )
                    }
                  >
                    {({ active, selected }) => (
                      <span
                        className={classNames('block truncate pl-2')}
                        title={option?.tooltip !== option.label ? option.tooltip : 'No description found'}
                      >
                        {option?.label && option.label}
                      </span>
                    )}
                  </Combobox.Option>
                ))}
              </Combobox.Options>
            )}
          </div>
        </Combobox>
      </div>
      <div className='sm:col-span-2'>
        <Combobox className='w-full z-50 px-8' as='div' value={tags} onChange={setTags} multiple>
          <Combobox.Label>
            <p className='block font-semibold leading-6 mt-4 text-slate-200 '>Tags</p>
            <p className='block leading-5 text-xs text-slate-500'>Press enter to submit a new tag</p>
          </Combobox.Label>
          <div className='relative mt-1'>
            <Combobox.Input
              className='px-3 block hover:ring-2 w-full bg-dark-800  rounded-md border-0 py-2 text-slate-100 shadow-sm ring-1 placeholder:text-gray-400 focus:ring-1 focus:ring-inset outline-none focus:ring-info-200 sm:text-sm sm:leading-6'
              onChange={(event) => setQuery(event.target.value)}
              displayValue={(option: JSONObject) => option.label}
            />

            <Combobox.Button className='absolute border-l border-dark-300 my-1  inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
              <ChevronUpDownIcon className='h-5 w-5 text-slate-400' aria-hidden='true' />
            </Combobox.Button>

            <Combobox.Options className='absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-b-md bg-dark-400 py-1 text-base shadow-lg ring-1 ring-gray-200 ring-opacity-5 focus:outline-none sm:text-sm'>
              {!tags.find((t: JSONObject) => t.label === query) && query.length > 0 && (
                <Combobox.Option
                  value={{ label: query }}
                  className={({ active }) =>
                    classNames(
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                      active ? 'bg-slate-900 text-slate-300' : 'text-slate-400'
                    )
                  }
                >
                  {({ active, selected }) => (
                    <span className={classNames('block truncate pl-2')}>{`Create "${query}"`}</span>
                  )}
                </Combobox.Option>
              )}
              {filteredOptions.length > 0 &&
                filteredOptions.map((option: JSONObject) => (
                  <Combobox.Option
                    key={option.label}
                    value={option}
                    onClick={() => setTags([...tags, option])}
                    className={({ active }) =>
                      classNames(
                        'relative cursor-default select-none py-2 pl-3 pr-9',
                        active ? 'bg-slate-900 text-slate-300' : 'text-slate-400'
                      )
                    }
                  >
                    {({ active, selected }) => (
                      <span className={classNames('block truncate pl-2')}>{option?.label && option.label}</span>
                    )}
                  </Combobox.Option>
                ))}
            </Combobox.Options>
          </div>
        </Combobox>
        <div className='px-8 relative w-full flex mt-4 z-10 flex-wrap'>
          <button className='invisible h-[26px] w-0'></button>
          {tags.map((tag: any) => {
            return (
              <button
                onClick={() => {
                  setTags([...tags.filter((t: JSONObject) => t.label !== tag.label)]);
                }}
                key={tag.label}
                className='ring-1 hover:ring-2 min-w-min relative  rounded-md py-1 text-slate-400 text-xs px-2.5 flex items-center mr-1 last:mr-0'
              >
                <span>{tag.label}</span>
                <XMarkIcon className='w-4 text-slate-400 h-4 ml-1' />
              </button>
            );
          })}
        </div>
      </div>
      {/* <div className='sm:col-span-2'>
        <label htmlFor='message' className='block font-semibold leading-6 mt-4 text-slate-200 pl-8'>
          Upload media
        </label>
        <div className='mt-2.5 px-8'>
          <label
            id='message'
            className='block w-full bg-dark-800  rounded-md border-0 px-3.5 py-2 text-slate-400 shadow-sm ring-1 focus:ring-1 focus:ring-inset outline-none focus:ring-info-200 sm:text-sm sm:leading-6'
            defaultValue={''}
          >
            Click here to upload your files
            <input type='file' data-label onChange={(event: any) => event.preventDefault()} />
          </label>
        </div>
      </div> */}
      <div className='mx-auto px-8 mt-3 max-w-7xl'>
        <button className='flex w-full rounded-md items-center hover:bg-dark-700 bg-dark-800 px-4 py-6 sm:px-6 lg:px-8'>
          <div className='flex relative items-center'>
            <PlusIcon className='w-5 h-5 mr-2 relative text-white' />
            <p className=' font-semibold leading-6 text-slate-200'>Additional attributes</p>
          </div>
        </button>
      </div>
      <Switch.Group as='div' className='px-4 py-5 sm:p-6'>
        <Switch.Label as='h3' className='mx-4 text-base font-semibold leading-6 text-slate-200' passive>
          Subscribe
        </Switch.Label>
        <div className='mt-2 mx-4 sm:flex sm:items-start sm:justify-between'>
          <div className='max-w-xl text-sm text-slate-400'>
            <Switch.Description>Subscribe to this incidents updates</Switch.Description>
          </div>
          <div className='mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center'>
            <Switch
              checked={enabled}
              onChange={setEnabled}
              className={classNames(
                enabled ? 'bg-info-200' : 'bg-info-600',
                'relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-info-200 focus:ring-offset-2 ring-2'
              )}
            >
              <span
                aria-hidden='true'
                className={classNames(
                  enabled ? 'translate-x-7 bg-slate-200' : 'translate-x-0 bg-slate-600',
                  'inline-block h-6 w-6  transform rounded-full shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>
          </div>
        </div>
      </Switch.Group>
      <div className='mt-2 flex items-center justify-end relative w-full px-8 pb-6'>
        <button
          onClick={(e) => closeModal()}
          type='button'
          className='relative inline-flex items-center rounded-md border-danger-600 border px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 hover:border-danger-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-400 mr-4'
        >
          Cancel
        </button>
        <button className='flex px-2 py-2 hover:ring-2 focus:ring-1 focus:ring-inset outline-none items-center text-slate-400 hover:text-slate-200 rounded-md ring-1 '>
          <span className='mx-2'>Create project</span>
          <PlusIcon className='w-5 h-5 text-white' />
        </button>
      </div>
    </div>
  );
}
