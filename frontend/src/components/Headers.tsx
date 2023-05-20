import classNames from 'classnames';

export const PageHeader = ({ title, header, className }: any) => {
  return (
    <div className={classNames('relative mx-auto flex w-full justify-center sm:px-2 lg:px-4 ', className ? className : '-z-10')}>
      <div className='min-w-0 max-w-2xl flex-auto pt-3 lg:max-w-none lg:pr-0 px-2'>
        <article>
          <header className='space-y-1'>
            {title && <h4 className='font-display text-sm font-medium text-sky-500'>{title}</h4>}
            {header && (
              <h1 className='font-display text-3xl tracking-tight text-slate-400 dark:text-slate-300'>{header}</h1>
            )}
          </header>
        </article>
      </div>
    </div>
  );
};
