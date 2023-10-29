import React from 'react';
import { HeroBackground } from '@/components/Icons';
import blurCyanImage from '@images/blur-cyan.png';
import blurIndigoImage from '@images/blur-indigo.png';

export default function LandingPage(): React.ReactElement {
  return (
    <>
      <div className='overflow-hidden bg-slate-900 mt-[-4.5rem] pb-32 pt-[4.5rem] lg:pt-[4.75rem]'>
        <div className='pt-16 sm:px-2 lg:relative  lg:px-0'>
          <div className='mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-16 py-24 gap-x-8 px-4 lg:max-w-8xl lg:grid-cols-2 lg:px-8 xl:gap-x-16 xl:px-12'>
            <div className='relative z-10 md:text-center lg:text-left'>
              <img
                className='absolute bottom-full right-full -mr-72 -mb-56 opacity-50'
                src={blurCyanImage}
                alt=''
                width={530}
                height={530}
              />
              <div className='relative'>
                <p className='inline bg-gradient-to-r from-indigo-200 via-sky-400 to-indigo-200 bg-clip-text font-display text-5xl tracking-tight text-transparent'>
                  Open Source Intelligence
                </p>
                <p className='mt-3 text-2xl tracking-tight text-slate-400'>
                  Fetch data from different sources and returns the results as visual entities that you can explore.
                </p>
                <div className='mt-8 flex gap-4 md:justify-center lg:justify-start'>
                  <button
                    onClick={() => {
                      window.location.href = window.sdk.getSigninUrl();
                    }}
                    className='rounded-full bg-sky-300 py-2 px-4 text-sm font-semibold text-slate-900 hover:bg-sky-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50 active:bg-sky-500'
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = window.sdk.getSignupUrl();
                    }}
                    className='rounded-full bg-slate-800 py-2 px-4 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 active:text-slate-400'
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>
            <div className='relative lg:static xl:pl-10'>
              <div className='absolute inset-x-[-50vw] -top-32 -bottom-48 [mask-image:linear-gradient(transparent,white,white)] dark:[mask-image:linear-gradient(transparent,white,transparent)] lg:left-[calc(50%+14rem)] lg:right-0 lg:-top-32 lg:-bottom-32 lg:[mask-image:none] lg:dark:[mask-image:linear-gradient(white,white,transparent)]'>
                <HeroBackground className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 lg:translate-y-[-60%]' />
              </div>
              <div className='relative'>
                <img className='absolute -top-64 -right-64' src={blurIndigoImage} alt='' width={530} height={530} />
                <img className='absolute -bottom-40 -right-44' src={blurIndigoImage} alt='' width={567} height={567} />
                <div className='absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-10 blur-lg' />
              </div>
            </div>
          </div>
        </div>
        <div className='overflow-hidden bg-slate-900'>
          <div className='sm:px-2 lg:relative  lg:px-0'>
            <div className='mx-auto grid -mt-20 max-w-2xl grid-cols-1 items-center gap-x-8 lg:max-w-8xl lg:grid-cols-2 xl:gap-x-16 xl:px-12'>
              <div className='relative z-10 md:text-center lg:text-left'>
                <article>
                  <header className='space-y-1'>
                    <p className='font-display text-sm font-medium text-sky-500'>Getting started</p>
                    <h1 className='font-display text-3xl tracking-tight text-slate-200 dark:text-white'>
                      Welcome to OSINTBuddy
                    </h1>
                  </header>
                </article>
                <div className='docs max-w-4xl text-slate-400 mt-2'>v0.1.0</div>
                <div className='docs max-w-4xl text-slate-400 py-2'>Hi, I'm the creator of OSINTBuddy. Want a chance at having your feature ideas prioritized? Email <a href='mailto:ideas@forum.osintbuddy.com' className='text-sky-500'>ideas@forum.osintbuddy.com</a> with the subject: <i>Early Access Request</i>. The first 50 people to reach out will have their suggestions put up for vote on the osintbuddy website so the community can decide what gets built first!
                </div>.
              </div>
              <div className='hidden xl:sticky xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto  xl:pr-6'>
                <nav aria-labelledby='on-this-page-title' className='w-56'></nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
