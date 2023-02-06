import { GoogleIcon } from '@/components/Icons';
import api from '@/services/api.service';
import { Combobox } from '@headlessui/react';
import { ChevronUpDownIcon, DocumentIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { useCallback, useEffect, useRef, useState } from 'react';

export function GoogleNode() {
  return (
    <div className='-m-3 flex flex-col justify-between rounded-lg p-3 transition duration-150 ease-in-out hover:bg-light-200 bg-light-100 w-72'>
      <div className='flex md:h-full '>
        <div className='flex-shrink-0 '>
          <div className='inline-flex  h-10 w-10 items-center justify-center rounded-md bg-info-200 text-white sm:h-12 sm:w-12'>
            <GoogleIcon className='h-6 w-6' aria-hidden='true' />
          </div>
        </div>
        <div className='md:flex-col md:flex md:flex-1  md:justify-between '>
          <form className='flex items-start flex-col'>
            <div className='flex items-center'>
              <p className='text-xs font-medium  text-dark mx-2'>Query</p>
              <div className='mt-1 w-full flex bg-light-200 py-0.5 border-gray-50 relative border-opacity-20  text-gray-500 border rounded-sm focus:border-opacity-100  text-xs'>
                <MagnifyingGlassIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                <input
                  type='text'
                  className='placeholder:text-gray-50  focus:outline-none pl-4 w-full bg-light-200 focus:bg-light-50'
                  placeholder='HTTP 403'
                />
              </div>
            </div>
            <div className='flex items-center'>
              <p className='text-xs font-medium  text-dark mx-2'>Pages</p>

              <div className='mt-1 w-full flex bg-light-200 py-0.5 border-gray-50 relative border-opacity-20  text-gray-500 border rounded-sm focus:border-opacity-100  text-xs'>
                <DocumentIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                <input
                  type='text'
                  defaultValue={3}
                  className='placeholder:text-gray-50  focus:outline-none pl-4 w-full bg-light-200 focus:bg-light-50'
                  placeholder='HTTP 403'
                />
              </div>
            </div>

            <button className='flex mt-2 py-1 ml-auto items-center bg-primary rounded-sm justify-between px-3'>
              <p className=' text-xs font-medium flex text-white whitespace-nowrap'>Search Google</p>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const cseData = [
  { url: -1, title: 'All', description: 'Run a search through all the CSE links' },
  // More users...
];

export function CseNode() {
  const isMounted = useRef(false);
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [activeCseData, setActiveCseData] = useState([]);
  const [cseData, setCseData] = useState([]);


  const getCseLinks = useCallback(() => {
    api
      .get('/cses/links')
      .then((resp) => {
        console.log(resp);
        setCseData(resp.data)
      })
      .catch((error) => {
        console.warn(error);
      });
  }, [cseData]);
  const filteredCseOptions =
    query === ''
      ? cseData
      : cseData.filter((cseOption: any) => {
          return cseOption.title.toLowerCase().includes(query.toLowerCase());
        });
  useEffect(() => {
    if (isMounted.current) {
      console.log('fetching');
    } else {
      isMounted.current = true;
      getCseLinks()
    }
  }, [isMounted]);
  return (
    <div className='-m-3 flex flex-col justify-between rounded-lg p-3 transition duration-150 ease-in-out hover:bg-light-200 bg-light-100 w-[32rem]'>
      <div className='flex md:h-full '>
        <div className='flex-shrink-0 '>
          <div className='inline-flex  h-10 w-10 items-center justify-center rounded-md bg-primary text-white sm:h-12 sm:w-12'>
            <GoogleIcon className='h-6 w-6' aria-hidden='true' />
          </div>
        </div>
        <div className='md:flex-col md:flex md:flex-1  md:justify-between '>
          <form className='flex items-start flex-col'>
            <div className='flex items-center'>
              <p className='text-xs font-medium  text-dark mx-2'>Query</p>
              <div className='mt-1 w-full flex bg-light-200 py-0.5 border-gray-50 relative border-opacity-20  text-gray-500 border rounded-sm focus:border-opacity-100  text-xs'>
                <MagnifyingGlassIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                <input
                  type='text'
                  className='placeholder:text-gray-50  focus:outline-none pl-4 w-full bg-light-200 focus:bg-light-50'
                  placeholder='HTTP 403'
                />
              </div>
            </div>
            <div className='flex items-center'>
              <p className='text-xs font-medium  text-dark mx-2'>Pages</p>

              <div className='mt-1 w-full flex bg-light-200 py-0.5 border-gray-50 relative border-opacity-20  text-gray-500 border rounded-sm focus:border-opacity-100  text-xs'>
                <DocumentIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                <input
                  type='text'
                  defaultValue={3}
                  className='placeholder:text-gray-50  focus:outline-none pl-4 w-full bg-light-200 focus:bg-light-50'
                  placeholder='HTTP 403'
                />
              </div>
            </div>

            <button className='flex mt-2 py-1 ml-auto items-center bg-primary rounded-sm justify-between px-3'>
              <p className=' text-xs font-medium flex text-white whitespace-nowrap'>Search Google</p>
            </button>
            <Combobox className='w-full' as='div' value={selectedPerson} onChange={setSelectedPerson}>
              <Combobox.Label className='block text-sm font-medium text-gray-700 font-display'>CSE Categories</Combobox.Label>
              <div className='relative mt-1'>
                <Combobox.Input
                  className='w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm'
                  onChange={(event) => setQuery(event.target.value)}
                  displayValue={(person: any) => person?.title}
                />
                <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
                  <ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                </Combobox.Button>

                {filteredCseOptions.length > 0 && (
                  <Combobox.Options className='absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-md bg-light-200 py-1 text-base shadow-lg ring-1 ring-gray-200 ring-opacity-5 focus:outline-none sm:text-sm'>
                    {filteredCseOptions.map((cseOption: any) => (
                      <Combobox.Option
                        key={cseOption.url}
                        value={cseOption}
                        className={({ active }) =>
                          classNames(
                            'relative cursor-default select-none py-2 pl-3 pr-9 ',
                            active ? 'bg-light-400 text-white' : 'text-gray-900'
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <>
                            <span className={classNames('block truncate pl-7', selected && 'font-semibold')}>
                              {cseOption.title}
                            </span>

                            {selected && (
                              <span
                                className={classNames(
                                  'absolute inset-y-0 right-0 flex items-center pr-4',
                                  active ? 'text-white' : 'text-indigo-600'
                                )}
                              >
                                <></>
                              </span>
                            )}
                            <div className='relative flex items-start'>
                              <div className='flex h-5 items-center'>
                                <input
                                  id='comments'
                                  aria-describedby='comments-description'
                                  name='comments'
                                  type='checkbox'
                                  className='h-4 w-4 rounded border-gray-300 bg-light-400 text-indigo-600 focus:ring-indigo-500'
                                />
                              </div>
                              <div className='ml-3 text-sm'>
                                <label htmlFor='comments' className='font-medium text-gray-700'>
                                  {cseOption.title}
                                </label>
                                <p id='comments-description' className='text-gray-500'>
                                 {cseOption.description}
                                </p>
                              </div>
                            </div>
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                )}
              </div>
            </Combobox>
          </form>
        </div>
      </div>
    </div>
  );
}

export function WebsiteNode() {
  return <>Website Node</>;
}
