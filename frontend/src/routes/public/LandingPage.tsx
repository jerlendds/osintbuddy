

export default function LandingPage(): React.ReactElement {
  return (
    <div className='bg-gray-50'>
      <div className='relative overflow-hidden'>
        <div className='absolute inset-y-0 h-full w-full' aria-hidden='true'>
          <div className='relative h-full'>
            
          </div>
        </div>

        <div className='relative pt-6 pb-16 sm:pb-24'>
          <div className='mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6'>
            <div className='text-center'>
              <h1 className='text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl'>
                <span className='block'>introducing OSINTBuddy</span>
                <span className='block text-indigo-600'>your all-in-one osint tool</span>
              </h1>
              <p className='mx-auto mt-3 max-w-md text-base text-gray-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl'>
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet
                fugiat veniam occaecat fugiat aliqua.
              </p>
            </div>
          </div>
        </div>

        <div className='relative'>
          <div className='absolute inset-0 flex flex-col' aria-hidden='true'>
            <div className='flex-1' />
            <div className='w-full flex-1 bg-gray-800' />
          </div>
          <div className='mx-auto max-w-7xl px-4 sm:px-6'>
            <img
              className='relative rounded-lg shadow-lg'
              src='https://tailwindui.com/img/component-images/top-nav-with-multi-column-layout-screenshot.jpg'
              alt='App screenshot'
            />
          </div>
        </div>
      </div>
      <div className='bg-gray-800'>
        <div className='mx-auto max-w-7xl py-16 px-4 sm:py-24 sm:px-6 lg:px-8'>
          <h2 className='text-center text-base font-semibold text-gray-400'>
            Trusted by over 26,000 forward-thinking companies
          </h2>
          <div className='mt-8 grid grid-cols-2 gap-8 md:grid-cols-6 lg:grid-cols-5'>
            <div className='col-span-1 flex justify-center md:col-span-2 lg:col-span-1'>
              <img className='h-12' src='https://tailwindui.com/img/logos/tuple-logo-gray-400.svg' alt='Tuple' />
            </div>
            <div className='col-span-1 flex justify-center md:col-span-2 lg:col-span-1'>
              <img className='h-12' src='https://tailwindui.com/img/logos/mirage-logo-gray-400.svg' alt='Mirage' />
            </div>
            <div className='col-span-1 flex justify-center md:col-span-2 lg:col-span-1'>
              <img
                className='h-12'
                src='https://tailwindui.com/img/logos/statickit-logo-gray-400.svg'
                alt='StaticKit'
              />
            </div>
            <div className='col-span-1 flex justify-center md:col-span-3 lg:col-span-1'>
              <img
                className='h-12'
                src='https://tailwindui.com/img/logos/transistor-logo-gray-400.svg'
                alt='Transistor'
              />
            </div>
            <div className='col-span-2 flex justify-center md:col-span-3 lg:col-span-1'>
              <img
                className='h-12'
                src='https://tailwindui.com/img/logos/workcation-logo-gray-400.svg'
                alt='Workcation'
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
