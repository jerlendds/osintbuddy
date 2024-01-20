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
      <div className='bg-mirage-800/30 w-full block shadow rounded-b-lg '>
        <div className='border-b border-mirage-300 mx-4 py-5 sm:px-6'>
          <div className='-ml-6 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap'>
            <div className='ml-4 mt-2 w-full'>
              <h1 className='text-2xl  w-full flex items-center justify-between'>
                <span className="half-grayscale  mr-2.5 opacity-30 right-0">🚧</span><p className="font-display font-semibold text-slate-300/90 mr-auto"> Under Construction</p>
                <span className="half-grayscale opacity-30 right-0 ml-auto">🚧</span>
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
