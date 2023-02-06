import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { Fragment, useState } from 'react';
import RoundLoader from './Loaders';

export interface SelectBoxOption {
  id: number;
  name: string;
}

export interface SelectBoxApi {
  label: string;
  loading: boolean;
  options: SelectBoxOption[];
  selected: SelectBoxOption;
  setSelected: Function
}

export default function SelectBoxApi({
  label,
  options,
  loading,
  selected,
  setSelected
}: SelectBoxApi) {

  return (
    <Listbox value={selected} onChange={(option) => setSelected(option)}>
      {({ open }) => (
        <>
          <Listbox.Label className='block text-sm font-medium text-gray-700'>{label}</Listbox.Label>
          <div className='relative mt-1'>
            <Listbox.Button className='max-w-xs relative w-full cursor-default rounded-md border border-gray-50 bg-light-200 py-2.5 pl-3 pr-10 text-left shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-xs'>
              <span className='block truncate font-display'>{selected.name}</span>
              <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              {loading && <RoundLoader className='text-dark-900' />}

                <ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='w-full max-w-xs  absolute z-10 mt-1 max-h-60  overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-xs '>
                {options.map((selectOption) => (
                  <Listbox.Option
                    key={selectOption.id}
                    className={({ active }) =>
                      classNames(
                        active ? 'text-white bg-primary' : '',
                        'relative cursor-default select-none py-2 pl-8 pr-4 '
                      )
                    }
                    value={selectOption}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate text-inherit font-display')}>
                          {selectOption.name}
                        </span>

                        {selected ? (
                          <span
                            className={classNames(
                              'absolute inset-y-0 left-0 flex items-center pl-1.5'
                            )}
                          >
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}