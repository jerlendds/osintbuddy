export default function LandingPage(): React.ReactElement {
  return (
    <div className='bg-light-400'>
      <div className='relative overflow-hidden  w-full'>
        <div className='absolute inset-y-0 h-full w-full' aria-hidden='true'>
          <div className='relative h-full'></div>
        </div>

        <div className='relative pt-6 pb-16 sm:pb-24'>
          <div className='mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6'>
            <div className='text-center'>
              <h1 className='text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl flex flex-col items-start'>
                <span className='block font-display text-dark-500'>Introducing <span className='text-primary-600'>OSINTBuddy</span></span>
                <span className='block text-light-700 font-display font-base text-base'>your all-in-one intelligence tool</span>
              </h1>
            
            </div>
          </div>
        </div>
      </div>
      <div className="bg-primary-800 mx-auto rounded-lg max-w-7xl py-4 px-7">  
        <div className="flex flex-col items-start">
          <p className='font-display font-medium'>Find what you're looking for with OSINTBuddy</p>
          <p className=''>Hello World!</p>
        </div>
      </div>
         <div className='relative pt-6 pb-16 sm:pb-24'>
          <div className='mx-auto mt-16 max-w-7xl px-4 sm:mt-24 sm:px-6'>
            <div className='text-center'>
              <h1 className='text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl flex flex-col items-start'>
                <span className='block font-display text-dark-500'>How can OSINTBuddy help?</span>
                <span className='block text-dark-700 font-light font-base text-base'>Learn how osintbuddy helps marketers, investigators, and hackers</span>
              </h1>
            
            </div>
          </div>
      </div>
    </div>
  );
}
