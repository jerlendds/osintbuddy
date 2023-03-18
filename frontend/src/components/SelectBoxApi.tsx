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
          <Listbox.Label className='block text-sm font-medium text-slate-400'>{label}</Listbox.Label>
          <div className='relative mt-1'>
            <Listbox.Button className='max-w-xs relative w-full cursor-default rounded-md border border-slate-900 bg-dark-300 py-2.5 pl-3 pr-10 text-left shadow-lg focus:border-info-200 focus:outline-none sm:text-xs text-slate-400'>
              <span className='block truncate font-display'>{selected.name}</span>
              <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
              {loading && <RoundLoader className='text-slate-400' />}

                <ChevronUpDownIcon className='h-5 w-5 text-slate-400' aria-hidden='true' />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='w-full max-w-xs  absolute z-10 mt-1 max-h-60  overflow-auto rounded-md bg-dark-400 py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                {options.map((selectOption) => (
                  <Listbox.Option
                    key={selectOption.id}
                    className={({ active }) =>
                      classNames(
                        active ? ' bg-slate-900' : '',
                        'relative cursor-default select-none py-2 pl-8 pr-4  text-slate-400'
                      )
                    }
                    value={selectOption}
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={classNames(selected ? 'font-semibold' : 'font-normal', 'block truncate text-inherit font-display text-slate-400')}>
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