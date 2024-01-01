import React, { useEffect, useRef } from 'react';
import { HeroBackground } from '@src/components/Icons';
import Earth from '@tarii/3d-earth'
import { useEffectOnce } from '@src/app/hooks';

const QUOTES = [
  "It's the connections that give it meaning",
  "Vision is the art of seeing insight in the invisible",
  "Reveal the connections behind actionable insights",
]

export default function LandingPage(): React.ReactElement {
  const earthRef = useRef<HTMLDivElement>(null)
  const atfQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)]
  useEffectOnce(() => {
    if (earthRef?.current) {
      const earth = new Earth({
        parent: earthRef.current as HTMLDivElement,
        rotateSpeed: 0.0005,
        pointColor: 0x242E4D,
        pointHighlight: 0x394778,
        fogColor: 0x005c5f,
        lineHighlightSize: 10,
        minLineSpacing: 30,
        maxLineSpacing: 1000,
        coords: [
          39.804935, 114.973428,
          10.106263, 39.144935,
          41.997906, -1.405880,
          39.897687, -122.714527,
          9.171568, -66.633754,
          -35.15, 149.08,
          -6.09, 106.49
        ],
        pointFlashSpeed: 0.0001,
        pointRadius: 0.5,
        pointSegments: 5,
      })

      earth.randomLinkAnimator()
      earth.start()
    }

  })
  return (
    <>
      <div className=' h-full min-h-screen relative flex flex-col justify-between items-between overflow-scroll'>
        <div className='lg:pt-32 pt-16 top-8 px-4 relative'>
          <div className='mx-auto  grid max-w-2xl grid-cols-1 items-center gap-y-16 lg:max-w-8xl lg:grid-cols-2 '>
            <div className='relative px- sm:px-3 z-10 md:text-center lg:text-left'>
              <div className='relative pb-12'>
                <p className='inline bg-gradient-to-r from-primary-300 via-primary-200 to-primary-400/90 bg-clip-text text-4xl font-display font-medium tracking-tight text-transparent'>
                  Elevate your Research with<br /> Strategic Insights from Public Data
                </p>
                <p className='pt-1 text-lg tracking-tight  text-slate-400'>
                  Reveal the connections that shape our world and stay informed with targeted insights from public data. We're on a mission to democratize access to open source intelligence and analytics.
                </p>
                <div className='mt-5 lg:mt-4 flex gap-4 md:justify-center lg:justify-start'>
                  <button
                    onClick={() => {
                      window.location.href = window.sdk.getSigninUrl();
                    }}
                    className='btn-primary-solid '
                  >
                    Sign in
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = window.sdk.getSignupUrl();
                    }}
                    className='btn-primary '
                  >
                    Create account
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div ref={earthRef} className='z-0 absolute w-[20rem]  md:w-[40rem] lg:w-[54rem] md:h-[100%] h-[30rem] lg:h-[80rem] lg:mt-10 -mt-20 md:-mt-10 sm:ml-20 [mask-image:linear-gradient(transparent,white,white)] dark:[mask-image:linear-gradient(transparent,#2D385EAF,#14192A6F)] lg:-top-full top-0 right-0' />
        </div>
        <div className='relative mt-full bottom-0 mx-4 sm:px-0 mb-0 h-min'>
          <div className='mx-auto grid h-full max-w-2xl grid-cols-1 mt-auto mb-0 items-center lg:max-w-8xl '>
            <div className='relative z-10 md:text-center lg:text-left '>
              <header className='space-y-1 mt-24'>
                <p className='font-display text-sm font-medium text-primary-300'>Welcome to ICgraph</p>
                <h1 className='font-display text-3xl tracking-tight text-slate-300 dark:text-slate-300'>
                  {atfQuote}
                </h1>
              </header>

              <div className='docs max-w-4xl text-slate-400 py-2'>Please email <a href='mailto:oss@osintbuddy.com' className='text-primary-200 hover:text-primary-200/80 transition-colors duration-100 ease-in-out'>oss@icgraph.com</a> to share ideas, bugs, or security concerns
              </div>.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
