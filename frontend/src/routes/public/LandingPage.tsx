import React, { useState } from 'react';
import { HeroBackground } from '@/components/Icons';
import blurCyanImage from '@images/blur-cyan.png';
import blurIndigoImage from '@images/blur-indigo.png';
import { Link } from 'react-router-dom';
import Markdoc from '@markdoc/markdoc';
import tags from './markdoc/tags';
import nodes from './markdoc/nodes';

export default function LandingPage(): React.ReactElement {
  const [text, setText] = useState(`
Click the get started button above to login to your system.
#### OSINTBuddy v0.2.1
  `);

  const ast = Markdoc.parse(text);
  // @ts-ignore
  const content = Markdoc.transform(ast, { tags, nodes });
  console.log(ast, content);

  return (
    <>
      <div className='overflow-hidden bg-slate-900 dark:mt-[-4.5rem] dark:pb-32 dark:pt-[4.5rem] dark:lg:mt-[-4.75rem] dark:lg:pt-[4.75rem]'>
        <div className='py-16 sm:px-2 lg:relative  lg:px-0'>
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
                  <Link
                    to='/app/dashboard'
                    replace
                    className='rounded-full bg-sky-300 py-2 px-4 text-sm font-semibold text-slate-900 hover:bg-sky-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50 active:bg-sky-500'
                  >
                    Get started
                  </Link>
                  <a
                    href='https://github.com/jerlendds/osintbuddy'
                    target='_blank'
                    className='rounded-full bg-slate-800 py-2 px-4 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 active:text-slate-400'
                  >
                    View on GitHub
                  </a>
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
      </div>

      <div className='relative mx-auto bg-slate-900 flex w-full justify-center sm:px-2 lg:px-0 '>
        <div className='min-w-0  max-w-2xl flex-auto py-4 lg:max-w-none lg:pr-0 2xl:px-64 lg:px-10 px-2'>
          <article>
            <header className='mb-9 space-y-1'>
              <p className='font-display text-sm font-medium text-sky-500'>Getting started</p>
              <h1 className='font-display text-3xl tracking-tight text-slate-200 dark:text-white'>
                Welcome to your OSINT Buddy
              </h1>
            </header>
          </article>
          <div className='docs max-w-4xl text-slate-400'>{Markdoc.renderers.react(content, React)}</div>
        </div>
        <div className='hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6'>
          <nav aria-labelledby='on-this-page-title' className='w-56'></nav>
        </div>
      </div>
    </>
  );
}
