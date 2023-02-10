import classNames from 'classnames';

interface RoundLoaderProps {
  className?: string;
}

export default function RoundLoader({ className }: RoundLoaderProps): React.ReactElement {
  return (
    <div className='flex items-center'>
      <div className={classNames('w-3 h-3 rounded-full animate-spin border-2 border-solid border-dark-200 border-t-transparent', className)}>
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  );
}
