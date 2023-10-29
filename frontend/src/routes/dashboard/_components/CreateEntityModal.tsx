import sdk from '@/app/api';
import { Dialog, Transition } from '@headlessui/react';
import { PencilIcon } from '@heroicons/react/24/outline';
import { useTour } from '@reactour/tour';
import { Formik } from 'formik';
import { Fragment, MutableRefObject, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';


export function CreateEntityForm({ closeModal, updateTable }: JSONObject) {
  const navigate = useNavigate();
  const [tags, setTags] = useState<any>([]);
  const [query, setQuery] = useState('');
  const [activeOption, setActiveOption] = useState(null);

  const filteredOptions =
    query === ''
      ? tags ?? []
      : tags.filter((option: any) => {
        return option.label.toLowerCase().includes(query.toLowerCase());
      }) ?? [];


  return (
    <Formik
      initialValues={{ label: '', description: '', author: '' }}
      validate={(values: JSONObject) => {
        const errors: JSONObject = {};
        if (values.label.length < 1) {
          errors.label = 'A label is required to create an entity'
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        sdk.entities.createEntity(values)
          .then((data) => {
            updateTable(data);
            toast.info(`Created the ${data?.name || ''} entity`);
            closeModal();
          })
          .catch((err) => {
            if (err.code === 'ERR_NETWORK') {
              toast.warn(
                "We ran into an error fetching your projects. Please try again by refreshing the page",
                {
                  autoClose: 10000,
                }
              );
            } else {
              toast.error(`Error: ${err}`);
            }
          });
        setSubmitting(false);
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <>
          <form onSubmit={(e: any) => handleSubmit(e)} className='bg-dark-600 w-full  shadow sm:rounded-lg'>
            <div className='border-b border-dark-300 mx-4 py-5 sm:px-6'>
              <div className='-ml-6 -mt-2 flex flex-wrap items-center justify-between sm:flex-nowrap'>
                <div className='ml-4 mt-2'>
                  <h1 className='font-display text-2xl tracking-tight text-slate-200 dark:text-white'>New Entity</h1>
                </div>
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label htmlFor='label' className='block font-semibold leading-6 mt-4 text-slate-200 pl-8'>
                Label
              </label>
              <div className='mt-2.5 px-8'>
                <input
                  onChange={handleChange}
                  value={values.label}
                  onBlur={handleBlur}
                  name='label'
                  id='label'
                  className='block w-full hover:ring-2 transition-all duration-100  bg-dark-800  rounded-md border-0 px-3.5 py-2 text-slate-100 shadow-sm ring-1 placeholder:text-gray-400 focus:ring-1 focus:ring-inset outline-none focus:ring-info-200 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label htmlFor='description' className='block font-semibold leading-6 mt-4 text-slate-200 pl-8'>
                Description
              </label>
              <div className='mt-2.5 px-8'>
                <textarea
                  name='description'
                  id='description'
                  rows={2}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  className='block hover:ring-2 w-full bg-dark-800  rounded-md border-0 px-3.5 py-2 text-slate-100 shadow-sm ring-1 placeholder:text-gray-400 focus:ring-1 focus:ring-inset outline-none focus:ring-info-200 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label htmlFor='author' className='block font-semibold leading-6 mt-4 text-slate-200 pl-8'>
                Author(s)
              </label>
              <div className='mt-2.5 px-8'>
                <input
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.author}
                  name='author'
                  id='author'
                  className='block w-full hover:ring-2 transition-all duration-100  bg-dark-800  rounded-md border-0 px-3.5 py-2 text-slate-100 shadow-sm ring-1 placeholder:text-gray-400 focus:ring-1 focus:ring-inset outline-none focus:ring-info-200 sm:text-sm sm:leading-6'
                />
              </div>
            </div>
            <div className='sm:col-span-2 mb-4 mx-8'>
              {/* <label htmlFor='description' className='block font-semibold leading-6 mt-4 text-slate-200'>
                Tags
              </label> */}
              {/* <Tags className='text-slate-400' /> */}
            </div>

            <div className='flex justify-end items-center px-8 pb-6 w-full relative'>
              <div className='mt-2 flex-shrink-0 flex items-center'>
                <button
                  onClick={() => closeModal()}
                  type='button'
                  className='relative inline-flex items-center rounded-md border-danger-600 border px-5 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 hover:border-danger-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-400 mr-4'
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  type='submit'
                  className='flex  px-2 py-2 hover:ring-2 focus:ring-1 focus:ring-inset outline-none items-center text-slate-400 hover:text-slate-200 rounded-md ring-1 '
                >
                  <span className='mx-2'>Start editing</span>
                  <PencilIcon className='w-5 h-5 text-inherit' />
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </Formik>
  );
}

export default function CreateEntityModal({
  closeModal,
  isOpen,
  cancelCreateRef,
  updateTable,
}: {
  cancelCreateRef: MutableRefObject<HTMLElement | null>;
  closeModal: Function;
  updateTable: Function;
  isOpen: boolean;
}) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' initialFocus={cancelCreateRef} onClose={() => closeModal()}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-dark-900 bg-opacity-75 transition-opacity' />
        </Transition.Child>

        <div className='fixed inset-0 z-10 overflow-y-auto'>
          <div className='flex min-h-full items-end justify-center text-center sm:items-center sm:p-0 '>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
              enterTo='opacity-100 translate-y-0 sm:scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 translate-y-0 sm:scale-100'
              leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            >
              <Dialog.Panel className='relative max-w-2xl w-full transform overflow-hidden rounded-lg text-left shadow-xl transition-all'>
                <CreateEntityForm
                  updateTable={(project: JSONObject) => updateTable(project)}
                  closeModal={() => closeModal()}
                />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}