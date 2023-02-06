import { GoogleIcon } from '@/components/Icons';
import { DocumentIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function GoogleNode() {
  return (
    <a className='-m-3 flex flex-col justify-between rounded-lg p-3 transition duration-150 ease-in-out hover:bg-light-200 bg-light-100 w-96'>
      <div className='flex md:h-full '>
        <div className='flex-shrink-0 '>
          <div className='inline-flex  h-10 w-10 items-center justify-center rounded-md bg-indigo-500 text-white sm:h-12 sm:w-12'>
            <GoogleIcon className='h-6 w-6' aria-hidden='true' />
          </div>
        </div>
        <div className='ml-4 md:flex-col md:flex md:flex-1  md:justify-between lg:ml-0 '>
          <div className="flex items-center">
            <p className='text-xs font-medium  text-dark mx-4'>Query: </p>
          <div className='mt-1 w-full flex bg-light-200 py-0.5 border-gray-50 relative border-opacity-20  text-gray-500 border rounded-sm focus:border-opacity-100  text-xs'>
            <MagnifyingGlassIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

            <input type='text' className='placeholder:text-gray-50  focus:outline-none pl-4 w-full bg-light-200 focus:bg-light-50' placeholder='HTTP 403' />
          </div>
          </div>
          <div className="flex items-center">
            <p className='text-xs font-medium  text-dark mx-4'>Pages: </p>

             <div className='mt-1 w-full flex bg-light-200 py-0.5 border-gray-50 relative border-opacity-20  text-gray-500 border rounded-sm focus:border-opacity-100  text-xs'>
            <DocumentIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

            <input type='text' defaultValue={3} className='placeholder:text-gray-50  focus:outline-none pl-4 w-full bg-light-200 focus:bg-light-50' placeholder='HTTP 403' />
          </div>
            <button className='flex mt-2 ml-4 py-1.5 items-center bg-primary rounded-sm justify-between px-3'>
            <p className=' text-xs font-medium flex text-white whitespace-nowrap'>Search Google</p>
          </button>
          </div>
         
        
        </div>
      </div>
    </a>
  );
}

export function CseNode() {
  return <>CSE Node</>;
}

export function WebsiteNode() {
  return <>Website Node</>;
}
