import classNames from 'classnames';
import { InquiryHeader } from './Headers';

interface RoundLoaderProps {
  className?: string;
}

export default function RoundLoader({ className }: RoundLoaderProps): React.ReactElement {
  return (
    <div className='flex items-center'>
      <div
        className={classNames(
          'w-3 h-3 rounded-full animate-spin border-2 border-solid border-dark-200 border-t-transparent',
          className
        )}
      >
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  );
}

export function UnderConstruction({ header, description, className = 'flex px-6' }: any) {
  return (
    <div className={className}>
      <div className='bg-mirage-700/50 w-full block shadow sm:rounded-lg '>
        <div className='border-b border-mirage-300 mx-4 py-5 sm:px-6'>
          <div className='-ml-6 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap'>
            <div className='ml-4 mt-2'>
              <h1 className='font-display text-2xl tracking-tight text-slate-300'>
                Under Construction
              </h1>
            </div>
          </div>
        </div>
        <section className='flex flex-col  px-3  mb-6'>
          <InquiryHeader className='z-10' title='New Feature' header={header} />
          <p className='my-3 ml-6 text-slate-400 max-w-xl'>
            {description}&nbsp;
            <a
              className='hover:text-primary-100 text-primary-200'
              href='https://github.com/jerlendds/osintbuddy/discussions'
              target='_blank'
            >
              github.com/jerlendds/osintbuddy/discussions
            </a>{' '}
          </p>
        </section>
      </div>
    </div>
  );
}
