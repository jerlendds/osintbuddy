import { ArchiveBoxIcon, BuildingLibraryIcon, CommandLineIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

export function QuickLinks({ children }: any) {
  return (
    <div className="not-prose my-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
      {children}
    </div>
  )
}

export function QuickLink({ title, description, href, icon }: any) {
  const getIcon = (iconType: string) => {
    if (iconType === 'install') return <PaperAirplaneIcon className='w-8 h-8' />
    if (iconType === 'presets') return <BuildingLibraryIcon className='w-8 h-8' />
    if (iconType === 'plugins') return <CommandLineIcon className='w-8 h-8' />
    if (iconType === 'theming') return <ArchiveBoxIcon className='w-8 h-8' />
    
    
    return <PaperAirplaneIcon className='w-8 h-8' />
  }

  return (
    <div className="group relative rounded-xl border border-slate-800 dark:border-slate-800">
      <div className="absolute -inset-px rounded-xl border-2 border-transparent opacity-0 [background:linear-gradient(var(--quick-links-hover-bg,theme(colors.sky.50)),var(--quick-links-hover-bg,theme(colors.sky.50)))_padding-box,linear-gradient(to_top,theme(colors.indigo.400),theme(colors.cyan.400),theme(colors.sky.500))_border-box] group-hover:opacity-100 dark:[--quick-links-hover-bg:theme(colors.slate.800)]" />
      <div className="relative overflow-hidden rounded-xl p-6">
        {getIcon(icon)}
        <h2 className="font-display !mb-0 !mt-6 text-base text-slate-900 dark:text-white">
          <a className='text-base' href={href}>
            <span className="absolute -inset-px text-lg rounded-xl" />
            {title}
          </a>
        </h2>
        <p className="text-sm text-slate-700 dark:text-slate-400">
          {description}
        </p>
      </div>
    </div>
  )
}
