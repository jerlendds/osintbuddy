import { useState, useEffect, useRef, useCallback } from 'react';
import { GripIcon, IpIcon } from '@/components/Icons';
import api from '@/services/api.service';
import { ChevronUpDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Combobox } from '@headlessui/react';
import classNames from 'classnames';

let nodeId = 0;
const getId = () => `rnode_${nodeId++}`;

export function CseNode({ flowData }: any) {
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
        setCseData(resp.data);
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
      getCseLinks();
    }
  }, [isMounted]);
  return (
    <>
      <div className=' flex flex-col w-[30rem] max-w-2xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-aquamarine-800 text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>
              Google CSE (custom search engine)
            </p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display'>
              <span className='text-xs text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
          </div>
          <IpIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              <>
                <>
                  <div className='flex'>
                    <div className='flex flex-col'>
                      <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                        Query
                      </p>
                      <div className='flex items-center mb-1 mr-4'>
                        <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                          <MagnifyingGlassIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                          <input
                            type='text'
                            data-type='query'
                            onChange={(event: any) => null}
                            value={''}
                            className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-80 bg-light-200 focus:bg-light-50'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col'>
                      <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                        Pages
                      </p>
                      <div className='flex items-center mb-1'>
                        <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                          <MagnifyingGlassIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                          <input
                            type='number'
                            data-type='pages'
                            onChange={(event: any) => null}
                            value={3}
                            className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-20 bg-light-200 focus:bg-light-50'
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Combobox className='w-full' as='div' value={selectedPerson} onChange={setSelectedPerson}>
                    <Combobox.Label>
                      <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display mt-4'>
                        CSE Categories
                      </p>
                    </Combobox.Label>
                    <div className='relative mt-1'>
                      <Combobox.Input
                        className='mt-1 outline-none w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(person: any) => person?.title}
                      />
                      <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
                        <ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                      </Combobox.Button>

                      {filteredCseOptions.length > 0 && (
                        <Combobox.Options className='absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-md bg-light-200 py-1 text-base shadow-lg ring-1 ring-gray-200 ring-opacity-5 focus:outline-none sm:text-sm'>
                          {filteredCseOptions.map((cseOption: any) => (
                            <>
                              <Combobox.Option
                                // @ts-ignore
                                onClick={() => setActiveCseData([...activeCseData, cseOption])}
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
                                    {cseOption.description !== cseOption.title && (
                                      <span className={classNames('block font-display truncate font-semibold pl-3')}>
                                        {cseOption.title}
                                      </span>
                                    )}

                                    {activeCseData &&
                                      activeCseData.map(() => {
                                        return (
                                          <div className='relative  flex items-start'>
                                            <div className='ml-3 text-sm'>
                                              <p className='text-gray-500 font-display'>{cseOption.description}</p>
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </>
                                )}
                              </Combobox.Option>
                            </>
                          ))}
                        </Combobox.Options>
                      )}
                    </div>
                  </Combobox>
                </>
              </>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
