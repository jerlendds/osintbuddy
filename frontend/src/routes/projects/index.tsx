import projects from '@/services/projects.service';
import { ChevronUpDownIcon, EyeIcon, PlusIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { MutableRefObject, useCallback, useRef } from 'react';
import { Combobox, Dialog, Switch, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { type Column, type CellValue } from 'react-table';
import classNames from 'classnames';
import { Formik } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/Headers';
import { FetchProps, JSONObject } from '@/globals';
import Table from '@/components/Table';
import { toast } from 'react-toastify';
import { api } from '@/services';
import { useTour } from '@reactour/tour';

export function NewCaseForm({ closeModal, updateTable }: JSONObject) {
  const navigate = useNavigate();
  const [showTour, setShowTour] = useState(false);
  const [tags, setTags] = useState<any>([]);
  const [query, setQuery] = useState('');
  const [activeOption, setActiveOption] = useState(null);

  const filteredOptions =
    query === ''
      ? tags ?? []
      : tags.filter((option: any) => {
          return option.label.toLowerCase().includes(query.toLowerCase());
        }) ?? [];

  const { setIsOpen, setCurrentStep } = useTour();

  return (
    <Formik
      initialValues={{ name: '', description: '', showTour: showTour }}
      validate={(values: JSONObject) => {
        const errors: JSONObject = {};
        if (!values.name) {
          errors.name = 'A project name is a required field';
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        // @todo implement tags on the backend
        const newProjectData = { values, tags: tags.map((t: JSONObject) => t.label) };
        console.log(values);
        projects
          .createProject({ name: values.name, description: values.description })
          .then((resp) => {
            updateTable(resp.data);
            toast.info(`Created the ${resp?.data?.name || ''} project`);
            closeModal();
            if (showTour) {
              navigate(`/app/dashboard/${resp.data.id}`, {
                state: { activeProject: resp.data },
              });
              setIsOpen(true);
            }
          })
          .catch((err) => {
            console.log(err)
            if (err.code === 'ERR_NETWORK') {
              toast.warn('We ran into an error fetching your projects. Is the backend running and are you connected on localhost? (update the BACKEND_CORS_ORIGINS in your .env if you\'re on an interface that\'s not localhost)', {
                autoClose: 10000
              })
            } else {
              toast.error(`Error: ${err}`)
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
                  <h1 className='font-display text-2xl tracking-tight text-slate-200 dark:text-white'>New Project</h1>
                </div>
              </div>
            </div>
            <div className='sm:col-span-2'>
              <label htmlFor='name' className='block font-semibold leading-6 mt-4 text-slate-200 pl-8'>
                Name
              </label>
              <div className='mt-2.5 px-8'>
                <input
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.name}
                  type='text'
                  name='name'
                  id='name'
                  className='block w-full hover:ring-2 transition-all duration-100  bg-dark-800  rounded-md border-0 px-3.5 py-2 text-slate-100 shadow-sm ring-1 placeholder:text-gray-400 focus:ring-1 focus:ring-inset outline-none focus:ring-info-200 sm:text-sm sm:leading-6'
                />
              </div>
            </div>{' '}
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
            <div className='sm:col-span-2 mb-4'>
              <Combobox className='w-full z-50 px-8' as='div' value={tags} onChange={setTags} multiple>
                <Combobox.Label>
                  <p className='block font-semibold leading-6 mt-4 text-slate-200 '>Tags</p>
                  <p className='block leading-5 text-xs text-slate-500'>Press enter to submit a new tag</p>
                </Combobox.Label>
                <div className='relative mt-1'>
                  <Combobox.Input
                    className='px-3 block hover:ring-2 w-full bg-dark-800 rounded-md border-0 py-2 text-slate-100 shadow-sm ring-1 focus:ring-1 focus:ring-inset outline-none focus:ring-info-200 sm:text-sm sm:leading-6'
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(option: JSONObject) => option.label}
                  />

                  <Combobox.Button className='absolute border-l border-dark-300 my-1  inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
                    <ChevronUpDownIcon className='h-5 w-5 text-slate-400' aria-hidden='true' />
                  </Combobox.Button>

                  <Combobox.Options className='absolute z-50 mt-1 max-h-80 w-full overflow-auto rounded-b-md bg-dark-400 py-1 text-base shadow-lg ring-1 ring-gray-200 ring-opacity-5 focus:outline-none sm:text-sm'>
                    {!tags.find((t: JSONObject) => t.label === query) && query.length > 0 && (
                      <Combobox.Option
                        value={{ label: query }}
                        className={({ active }) =>
                          classNames(
                            'relative cursor-default select-none py-2 pl-3 pr-9',
                            active ? 'bg-slate-900 text-slate-300' : 'text-slate-400'
                          )
                        }
                      >
                        {({ active, selected }) => (
                          <span className={classNames('block truncate pl-2')}>{`Create "${query}"`}</span>
                        )}
                      </Combobox.Option>
                    )}
                    {filteredOptions.length > 0 &&
                      filteredOptions.map((option: JSONObject) => (
                        <Combobox.Option
                          key={option.label}
                          value={option}
                          className={({ active }) =>
                            classNames(
                              'relative cursor-default select-none py-2 pl-3 pr-9',
                              active ? 'bg-slate-900 text-slate-300' : 'text-slate-400'
                            )
                          }
                        >
                          {({ active, selected }) => (
                            <span
                              className={classNames('block truncate pl-2')}
                              title={option?.tooltip !== option.label ? option.tooltip : 'No description found'}
                            >
                              {option?.label && option.label}
                            </span>
                          )}
                        </Combobox.Option>
                      ))}
                  </Combobox.Options>
                </div>
                <input
                  data-node
                  readOnly
                  value={JSON.stringify(tags.map((t: JSONObject) => t.label))}
                  className='hidden invisible'
                />
              </Combobox>
              <div className='px-8 relative w-full flex mt-3 z-10 flex-wrap'>
                <button className='invisible h-[26px] w-0'></button>
                {tags.map((tag: any) => {
                  return (
                    <button
                      onClick={() => {
                        setTags([...tags.filter((t: JSONObject) => t.label !== tag.label)]);
                      }}
                      key={tag.label}
                      className='ring-1 hover:ring-2 min-w-min relative  rounded-md py-1 text-slate-400 text-xs px-2.5 flex items-center mr-1 last:mr-0'
                    >
                      <span>{tag.label}</span>
                      <XMarkIcon className='w-4 text-slate-400 h-4 ml-1' />
                    </button>
                  );
                })}
              </div>
            </div>
            <Switch.Group as='div' className='px-4 pb-5 sm:px-6 sm:col-span-2'>
              <Switch.Label as='h3' className='mx-4 text-base font-semibold leading-6 text-slate-200' passive>
                Enable Guide
              </Switch.Label>
              <div className='mt-2 mx-4 sm:flex sm:items-start sm:justify-between'>
                <div className='max-w-xl text-sm text-slate-400'>
                  <Switch.Description>
                    Get a step-by-step tour on how to use OSINTBuddy Investigations
                  </Switch.Description>
                </div>
                <div className='mt-5 sm:ml-6 sm:-mt-2 sm:flex sm:flex-shrink-0 sm:items-center'>
                  <Switch
                    checked={showTour}
                    onChange={setShowTour}
                    className={classNames(
                      showTour ? 'bg-info-200' : 'bg-dark-600',
                      'relative inline-flex h-7 w-14 flex-shrink-0 ring-1 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-info-200 focus:ring-offset-2 hover:ring-2 active:ring-2'
                    )}
                  >
                    <span
                      aria-hidden='true'
                      className={classNames(
                        showTour ? 'translate-x-7 bg-slate-200' : 'translate-x-0 bg-slate-400',
                        'inline-block h-6 w-6  transform rounded-full shadow ring-0 transition duration-200 ease-in-out'
                      )}
                    />
                  </Switch>
                </div>
              </div>
            </Switch.Group>
            <div className='flex justify-end items-center px-8 pb-6 w-full relative'>
              <div className='mt-2 flex-shrink-0 flex items-center'>
                <button
                  onClick={() => closeModal()}
                  type='button'
                  className='relative inline-flex items-center rounded-md border-danger-600 border px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-slate-200 hover:border-danger-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dark-400 mr-4'
                >
                  Cancel
                </button>
                <button
                  disabled={isSubmitting}
                  type='submit'
                  className='flex  px-2 py-2 hover:ring-2 focus:ring-1 focus:ring-inset outline-none items-center text-slate-400 hover:text-slate-200 rounded-md ring-1 '
                >
                  <span className='mx-2'>Create project</span>
                  <PlusIcon className='w-5 h-5 text-white' />
                </button>
              </div>
            </div>
          </form>
        </>
      )}
    </Formik>
  );
}

const ActionsRow = ({ row, updateTable }: JSONObject) => {
  return (
    <div className='flex items-center justify-between relative z-40 mb-1'>
      <Link
        to={`/app/dashboard/${row.original.id}`}
        state={{ activeProject: row.original }}
        className='flex whitespace-nowrap px-2 py-2 hover:ring-2 transition-all duration-75 ring-info-300 hover:ring-info-200 focus:ring-1 focus:ring-inset outline-none items-center text-slate-400 hover:text-slate-200 rounded-md ring-1 '
      >
        <span className='mx-2'>Investigate</span>
        <EyeIcon className='w-5 h-5 text-slate-400 mr-2' />{' '}
      </Link>
      <button
        onClick={() => {
          api
            .delete(`/cases?id=${row.original.id}`)
            .then(() => updateTable())
            .catch((error) => toast.error('We ran into an error deleting your project. Is the backend running?'));
        }}
        className='flex whitespace-nowrap ml-4 mr-auto px-2 py-2 hover:ring-2 ring-danger-600 focus:ring-1 focus:ring-inset outline-none items-center text-slate-400 hover:text-slate-200 rounded-md ring-1 '
      >
        <span className='mx-2'>Delete</span>
        <TrashIcon className='w-5 h-5 text-slate-400 mr-2' />{' '}
      </button>
    </div>
  );
};

function CreateCaseModal({
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
              <Dialog.Panel className='relative max-w-2xl w-full transform overflow-hidden rounded-lg  text-left shadow-xl transition-all '>
                <NewCaseForm
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

export default function DashboardPage() {
  let [isOpen, setIsOpen] = useState(false);
  const cancelCreateRef = useRef<HTMLElement>(null);

  const columns = React.useMemo<Column[]>(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Project name',
        accessor: 'name',
        Cell: (props): CellValue => props.value || '---',
      },
      {
        Header: 'Short description',
        accessor: 'description',
        Cell: (props): CellValue => props.value || '---',
      },
      {
        Header: 'Created',
        accessor: 'created',
        Cell: (props): CellValue => new Date(props.value).toDateString(),
      },
    ],
    []
  );

  const [pageCount, setPageCount] = useState(0);
  const [projectsData, setProjectsData] = useState<any>([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const fetchIdRef = useRef(0);

  const fetchProjectsData = useCallback(
    ({ pageSize, pageIndex }: FetchProps) => {
      const fetchId = ++fetchIdRef.current;
      setLoadingProjects(true);
      if (fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex;
        const endRow = startRow + pageSize;
        if (fetchId === fetchIdRef.current) {
          // @todo remove timeout
          setTimeout(() => {
            projects
              .getProjects(pageSize * pageIndex, pageSize)
              .then((resp) => {
                if (resp?.data) {
                  console.log(resp.data.count, Math.ceil(resp.data?.count / pageSize));
                  setPageCount(Math.ceil(resp.data?.count / pageSize));
                  setProjectsData(resp.data.projects);
                  setLoadingProjects(false);
                }
              })
              .catch((error) => {
                console.warn(error);
                setLoadingProjects(false);
              });
          }, 300);
        }
      }
    },
    [pageCount]
  );

  const updateTable = (newProject: JSONObject) => {
    setProjectsData([...projectsData, { ...newProject }]);
  };

  return (
    <>
      <PageHeader title='Investigations' header='All Projects' />
      <Table
        createButtonLabel={'Create project'}
        createButtonFunction={() => setIsOpen(true)}
        columns={columns}
        data={projectsData}
        fetchData={({ pageSize, pageIndex }: FetchProps) => fetchProjectsData({ pageSize, pageIndex })}
        loading={loadingProjects}
        CustomRow={ActionsRow}
        pageCount={pageCount}
      />
      <CreateCaseModal
        updateTable={(project: JSONObject) => updateTable(project)}
        cancelCreateRef={cancelCreateRef}
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
      />
    </>
  );
}
