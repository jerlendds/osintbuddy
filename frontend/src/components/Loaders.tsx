import classNames from 'classnames';

interface RoundLoaderProps {
  className?: string;
}

export default function RoundLoader({ className }: RoundLoaderProps): React.ReactElement {
  return (
    <div className='flex items-center'>
      <div className={classNames('w-4 h-4 rounded-full animate-spin border-4 border-solid border-light-200 border-t-transparent', className)}>
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  );
}
