import MarkdownPreview from "@uiw/react-markdown-preview";
import { Fragment } from 'react';
import Highlight, { defaultProps } from 'prism-react-renderer'
import { HeroBackground, TrafficLightsIcon } from '@/components/Icons';
import blurCyanImage from '@images/blur-cyan.png'
import blurIndigoImage from '@images/blur-indigo.png'
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import {MDXProvider} from '@mdx-js/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';


export default function LandingPage(): React.ReactElement {
  return (
 <>
 <div className="overflow-hidden bg-slate-900 dark:mt-[-4.5rem] dark:pb-32 dark:pt-[4.5rem] dark:lg:mt-[-4.75rem] dark:lg:pt-[4.75rem]">
      <div className="py-16 sm:px-2 lg:relative  lg:px-0">
        <div className="mx-auto grid max-w-2xl grid-cols-1 items-center gap-y-16 py-24 gap-x-8 px-4 lg:max-w-8xl lg:grid-cols-2 lg:px-8 xl:gap-x-16 xl:px-12">
          <div className="relative z-10 md:text-center lg:text-left">
            <img
              className="absolute bottom-full right-full -mr-72 -mb-56 opacity-50"
              src={blurCyanImage}
              alt=""
              width={530}
              height={530}
            />
            <div className="relative">
              <p className="inline bg-gradient-to-r from-indigo-200 via-sky-400 to-indigo-200 bg-clip-text font-display text-5xl tracking-tight text-transparent">
                Open Source Intelligence
              </p>
              <p className="mt-3 text-2xl tracking-tight text-slate-400">
                Fetch data from different sources and returns the results as visual entities that you can explore.
              </p>
              <div className="mt-8 flex gap-4 md:justify-center lg:justify-start">
                <Link to='/sign-in' replace className='rounded-full bg-sky-300 py-2 px-4 text-sm font-semibold text-slate-900 hover:bg-sky-200 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/50 active:bg-sky-500'>Get started</Link>
                <a href="https://github.com/jerlendds/osintbuddy" target="_blank" className='rounded-full bg-slate-800 py-2 px-4 text-sm font-medium text-white hover:bg-slate-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50 active:text-slate-400'>
                  View on GitHub
                </a>
              </div>
            </div>
          </div>
          <div className="relative lg:static xl:pl-10">
            <div className="absolute inset-x-[-50vw] -top-32 -bottom-48 [mask-image:linear-gradient(transparent,white,white)] dark:[mask-image:linear-gradient(transparent,white,transparent)] lg:left-[calc(50%+14rem)] lg:right-0 lg:-top-32 lg:-bottom-32 lg:[mask-image:none] lg:dark:[mask-image:linear-gradient(white,white,transparent)]">
              <HeroBackground className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 lg:translate-y-[-60%]" />
            </div>
            <div className="relative">
              <img
                className="absolute -top-64 -right-64"
                src={blurIndigoImage}
                alt=""
                width={530}
                height={530}
              />
              <img
                className="absolute -bottom-40 -right-44"
                src={blurIndigoImage}
                alt=""
                width={567}
                height={567}
              />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-10 blur-lg" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-sky-300 via-sky-300/70 to-blue-300 opacity-10" />
              <div className="relative rounded-2xl bg-[#0A101F]/80 ring-1 ring-white/10 backdrop-blur">
                <div className="absolute -top-px left-20 right-11 h-px bg-gradient-to-r from-sky-300/0 via-sky-300/70 to-sky-300/0" />
                <div className="absolute -bottom-px left-11 right-20 h-px bg-gradient-to-r from-blue-400/0 via-blue-400 to-blue-400/0" />
                <div className="pl-4 pt-4">
                  <TrafficLightsIcon className="h-2.5 w-auto stroke-slate-500/30" />
                
                  <div className="mt-6 flex items-start px-1 text-sm">
                    <div
                      aria-hidden="true"
                      className="select-none border-r border-slate-300/5 pr-4 font-mono text-slate-600"
                    >
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

<div className="relative ml-48 mx-auto flex w-full justify-center sm:px-2 lg:px-8 xl:px-12">
      
        <div className="min-w-0 max-w-2xl flex-auto px-4 py-4 lg:max-w-none lg:pr-0 lg:pl-8 xl:px-16">
          <article>
              <header className="mb-9 space-y-1">
                  <p className="font-display text-sm font-medium text-sky-500">
                    Introduction
                  </p>
                  <h1 className="font-display text-3xl tracking-tight text-slate-200 dark:text-white">
                    Getting Started with OSINTBuddy
                  </h1>
              </header>
          
          </article>
          <dl className="mt-12 flex border-t border-slate-400 pt-6 dark:border-slate-800">
            {true && (
              <div>
                <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
                  Previous
                </dt>
                <dd className="mt-1">
                  <Link
                    to={''}
                    className="text-base flex items-center font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    <ChevronLeftIcon className='text-slate-400 h-5 w-5 mr-2' />
                   {/* Welcome */}
                  </Link>
                </dd>
              </div>
            )}
            {true && (
              <div className="ml-auto text-right">
                <dt className="font-display text-sm font-medium text-slate-900 dark:text-white">
                  Next
                </dt>
                <dd className="mt-1">
                  <Link
                    to=''
                    className="text-base flex items-center font-semibold text-slate-500 hover:text-slate-600 dark:text-slate-400 dark:hover:text-slate-300"
                  >
                    {/* Node Workflow  */}
                    <ChevronRightIcon className='text-slate-400 h-5 w-5 ml-2' />
                  </Link>
                </dd>
              </div>
            )}
          </dl>
        </div>
        <div className="hidden xl:sticky xl:top-[4.5rem] xl:-mr-6 xl:block xl:h-[calc(100vh-4.5rem)] xl:flex-none xl:overflow-y-auto xl:py-16 xl:pr-6">
          <nav aria-labelledby="on-this-page-title" className="w-56">
          {/* @ts-ignore */}
          </nav>
        </div>
        
      </div>

    </>
  );
}
