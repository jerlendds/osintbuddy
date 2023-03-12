import { Disclosure, Transition } from '@headlessui/react';
import { PlusIcon } from '@heroicons/react/24/outline';

const searchOptions = [
  {
    name: 'Google Search',
    title: "Search Google using the advanced operators you're used to",
    event: 'google',
  },
  {
    name: 'CSE Search',
    title: 'Search by category through Google CSEs',
    event: 'cse',
  },
  {
    name: 'Domain',
    title: 'Find SEO data, IPs, and more',
    event: 'domain',
  },
  {
    name: 'Email',
    title: 'Find social accounts and more',
    event: 'email',
  },
    {
    name: 'IP',
    title: 'Geolocate an IP and more',
    event: 'ip',
  },
      {
    name: 'URL',
    title: 'A URL entity',
    event: 'url',
  },
  {
    name: 'Username',
    title: 'Find accounts by username',
    event: 'username',
  },
];

export default function NodeOptions() {
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Disclosure as='div' className='absolute bg-dark-300 w-44 py-2 left-5 top-16 z-50'>
      <Disclosure.Button className='text-xl items-center justify-between w-full flex px-4 '>
        <span className='font-display text-slate-400 font-semibold'>Nodes</span>
        <PlusIcon className='w-4 h-4 text-slate-400' />
      </Disclosure.Button>

      <Transition
        enter='transition duration-100 ease-out'
        enterFrom='transform scale-95 opacity-0'
        enterTo='transform scale-100 opacity-100'
        leave='transition duration-75 ease-out'
        leaveFrom='transform scale-100 opacity-100'
        leaveTo='transform scale-95 opacity-0'
      >
        <Disclosure.Panel className='flex'>
          <ul className='flex flex-col w-full py-2'>
            {searchOptions.map((searchOption) => (
              <li
                draggable
                key={searchOption.name}
                onDragStart={(event) => onDragStart(event, searchOption.event)}
                className='border-l-4 active:border-l-dark-400 py-2 my-1 bg-dark-400 flex items-center px-4 border-l-dark-50'
                title={searchOption.title}
              >
                <PlusIcon className='w-3 h-3 mr-1 text-slate-400' />
                <p className='text-xs font-medium text-slate-400 font-display'>{searchOption.name}</p>
              </li>
            ))}
          </ul>
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  );
}
