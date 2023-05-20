import classNames from 'classnames';
import { PageHeader } from './Headers';

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
      <div className='bg-dark-600 w-full block shadow sm:rounded-lg '>
        <div className='border-b border-dark-300 mx-4 py-5 sm:px-6'>
          <div className='-ml-6 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap'>
            <div className='ml-4 mt-2'>
              <h1 className='font-display text-2xl tracking-tight text-slate-200 dark:text-white'>
                Under Construction
              </h1>
            </div>
          </div>
        </div>
        <section className='flex flex-col  px-3  mb-6'>
          <PageHeader className='z-10' title='New Feature' header={header} />
          <p className='my-3 ml-6 text-slate-400 max-w-xl'>
            {description}&nbsp;
            <a
              className='hover:text-info-100 text-info-200'
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
