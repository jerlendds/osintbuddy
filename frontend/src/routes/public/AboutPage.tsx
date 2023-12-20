import {
  BoltIcon,
  ChatBubbleBottomCenterTextIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  ScaleIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { Disclosure } from '@headlessui/react';
import classNames from 'classnames';

const transferFeatures = [
  {
    id: 1,
    name: 'Competitive exchange rates',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: GlobeAltIcon,
  },
  {
    id: 2,
    name: 'No hidden fees',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: ScaleIcon,
  },
  {
    id: 3,
    name: 'Transfers are instant',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: BoltIcon,
  },
];
const communicationFeatures = [
  {
    id: 1,
    name: 'Mobile notifications',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: ChatBubbleBottomCenterTextIcon,
  },
  {
    id: 2,
    name: 'Reminder emails',
    description:
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Maiores impedit perferendis suscipit eaque, iste dolor cupiditate blanditiis ratione.',
    icon: EnvelopeIcon,
  },
];
const faqs = [
  {
    question: "What's the best thing about Switzerland?",
    answer:
      "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
  },
  // More questions...
];
export default function AboutPage() {
  return (
    <>
      <div className='overflow-hidden bg-dark text-light py-16 lg:py-24'>
        <div className='relative mx-auto max-w-xl px-6 lg:max-w-7xl lg:px-8'>
          <svg
            className='absolute left-full hidden -translate-x-1/2 -translate-y-1/4 transform lg:block'
            width={404}
            height={784}
            fill='none'
            viewBox='0 0 404 784'
            aria-hidden='true'
          >
            <defs>
              <pattern
                id='b1e6e422-73f8-40a6-b5d9-c8586e37e0e7'
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits='userSpaceOnUse'
              >
                <rect x={0} y={0} width={4} height={4} className='text-light-200' fill='currentColor' />
              </pattern>
            </defs>
            <rect width={404} height={784} fill='url(#b1e6e422-73f8-40a6-b5d9-c8586e37e0e7)' />
          </svg>

          <div className='relative'>
            <h2 className='text-center text-3xl font-bold leading-8 tracking-tight text-light-900 sm:text-4xl'>
              A better way to search for intelligence
            </h2>
            <p className='mx-auto mt-4 max-w-3xl text-center text-xl text-light-500'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus magnam voluptatum cupiditate veritatis
              in, accusamus quisquam.
            </p>
          </div>

          <div className='relative mt-12 lg:mt-24 lg:grid lg:grid-cols-2 lg:items-center lg:gap-8'>
            <div className='relative'>
              <h3 className='text-2xl font-bold tracking-tight text-light-900 sm:text-3xl'>Investigate people world-wide</h3>
              <p className='mt-3 text-lg text-light-500'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur minima sequi recusandae, porro maiores officia assumenda aliquam laborum ab aliquid veritatis impedit odit adipisci optio iste blanditiis
                facere. Totam, velit.
              </p>

              <dl className='mt-10 space-y-10'>
                {transferFeatures.map((item) => (
                  <div key={item.id} className='relative'>
                    <dt>
                      <div className='absolute flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-white'>
                        <item.icon className='h-8 w-8' aria-hidden='true' />
                      </div>
                      <p className='ml-16 text-lg font-medium leading-6 text-light-900'>{item.name}</p>
                    </dt>
                    <dd className='mt-2 ml-16 text-base text-light-500'>{item.description}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className='relative -mx-4 mt-10 lg:mt-0' aria-hidden='true'>
              <svg
                className='absolute left-1/2 -translate-x-1/2 translate-y-16 transform lg:hidden'
                width={784}
                height={404}
                fill='none'
                viewBox='0 0 784 404'
              >
                <defs>
                  <pattern
                    id='ca9667ae-9f92-4be7-abcb-9e3d727f2941'
                    x={0}
                    y={0}
                    width={20}
                    height={20}
                    patternUnits='userSpaceOnUse'
                  >
                    <rect x={0} y={0} width={4} height={4} className='text-light-200' fill='currentColor' />
                  </pattern>
                </defs>
                <rect width={784} height={404} fill='url(#ca9667ae-9f92-4be7-abcb-9e3d727f2941)' />
              </svg>
              <img
                className='relative mx-auto'
                width={490}
                src='https://tailwindui.com/img/features/feature-example-1.png'
                alt=''
              />
            </div>
          </div>

          <svg
            className='absolute right-full hidden translate-x-1/2 translate-y-12 transform lg:block'
            width={404}
            height={784}
            fill='none'
            viewBox='0 0 404 784'
            aria-hidden='true'
          >
            <defs>
              <pattern
                id='64e643ad-2176-4f86-b3d7-f2c5da3b6a6d'
                x={0}
                y={0}
                width={20}
                height={20}
                patternUnits='userSpaceOnUse'
              >
                <rect x={0} y={0} width={4} height={4} className='text-light-200' fill='currentColor' />
              </pattern>
            </defs>
            <rect width={404} height={784} fill='url(#64e643ad-2176-4f86-b3d7-f2c5da3b6a6d)' />
          </svg>

          <div className='relative mt-12 sm:mt-16 lg:mt-24'>
            <div className='lg:grid lg:grid-flow-row-dense lg:grid-cols-2 lg:items-center lg:gap-8'>
              <div className='lg:col-start-2'>
                <h3 className='text-2xl font-bold tracking-tight text-light-900 sm:text-3xl'>Always in the loop</h3>
                <p className='mt-3 text-lg text-light-500'>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit ex obcaecati natus eligendi delectus,
                  cum deleniti sunt in labore nihil quod quibusdam expedita nemo.
                </p>

                <dl className='mt-10 space-y-10'>
                  {communicationFeatures.map((item) => (
                    <div key={item.id} className='relative'>
                      <dt>
                        <div className='absolute flex h-12 w-12 items-center justify-center rounded-xl bg-primary-500 text-white'>
                          <item.icon className='h-8 w-8' aria-hidden='true' />
                        </div>
                        <p className='ml-16 text-lg font-medium leading-6 text-light-900'>{item.name}</p>
                      </dt>
                      <dd className='mt-2 ml-16 text-base text-light-500'>{item.description}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className='relative -mx-4 mt-10 lg:col-start-1 lg:mt-0'>
                <svg
                  className='absolute left-1/2 -translate-x-1/2 translate-y-16 transform lg:hidden'
                  width={784}
                  height={404}
                  fill='none'
                  viewBox='0 0 784 404'
                  aria-hidden='true'
                >
                  <defs>
                    <pattern
                      id='e80155a9-dfde-425a-b5ea-1f6fadd20131'
                      x={0}
                      y={0}
                      width={20}
                      height={20}
                      patternUnits='userSpaceOnUse'
                    >
                      <rect x={0} y={0} width={4} height={4} className='text-light-200' fill='currentColor' />
                    </pattern>
                  </defs>
                  <rect width={784} height={404} fill='url(#e80155a9-dfde-425a-b5ea-1f6fadd20131)' />
                </svg>
                <img
                  className='relative mx-auto'
                  width={490}
                  src='https://tailwindui.com/img/features/feature-example-2.png'
                  alt=''
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='bg-light-50'>
        <div className='mx-auto max-w-7xl py-12 px-4 sm:py-16 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-3xl divide-y-2 divide-light-200'>
            <h2 className='text-center text-3xl font-bold tracking-tight text-light-900 sm:text-4xl'>
              Frequently asked questions
            </h2>
            <dl className='mt-6 space-y-6 divide-y divide-light-200'>
              {faqs.map((faq: any) => (
                <Disclosure as='div' key={faq.question} className='pt-6'>
                  {({ open }) => (
                    <>
                      <dt className='text-lg'>
                        <Disclosure.Button className='flex w-full items-start justify-between text-left text-light-400'>
                          <span className='font-medium text-light-900'>{faq.question}</span>
                          <span className='ml-6 flex h-7 items-center'>
                            <ChevronDownIcon
                              className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                              aria-hidden='true'
                            />
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as='dd' className='mt-2 pr-12'>
                        <p className='text-base text-light-500'>{faq.answer}</p>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
