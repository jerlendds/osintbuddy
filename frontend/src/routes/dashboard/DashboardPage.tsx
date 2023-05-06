import casesService from '@/services/cases.service';
import { EyeIcon, FolderPlusIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { useTable, usePagination, type Column, type CellProps, CellValue } from 'react-table';
import dorksService from '@/services/dorks.service';
import classNames from 'classnames';
import { format as formatDate } from 'date-fns';

import { Formik, Form, Field } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '@/services';

interface MyFormValues {
  name: string;
  description: string;
}

export const CreateCasesForm: React.FC<{ closeModal: Function }> = ({ closeModal }) => {
  const initialValues: MyFormValues = { name: '', description: '' };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        onSubmit={(values, actions) => {
          console.log({ values, actions });
          casesService
            .createCase(values.name, values.description)
            .then((resp) => {
              console.log(resp.data);
            })
            .catch((error) => console.warn(error));
          actions.setSubmitting(false);
          closeModal();
        }}
      >
        <Form className='flex flex-col '>
          <div className='py-2'>
            <label className='text-sm font-medium text-slate-400  font-display mt-1' htmlFor='name'>
              Case name
            </label>
            <Field
              className='block placeholder:text-slate-400 w-full py-2 px-3 rounded-md shadow-sm  relative border-opacity-60  text-slate-200 focus:border-opacity-100  text-xs border border-info-400 focus:border-info-300 active:border-info-300 bg-slate-700 focus:ring-info-50 sm:text-sm'
              id='name'
              name='name'
              placeholder='Your name'
            />
          </div>
          <div className='py-2'>
            <label className='text-sm font-medium text-slate-400  font-display mt-1' htmlFor='description'>
              Case description
            </label>

            <Field name='description'>
              {({ field, form, meta }: any) => {
                return (
                  <textarea
                    rows={4}
                    value={field.value}
                    onChange={field.onChange}
                    name='description'
                    id='description'
                    className='block placeholder:text-slate-400 w-full py-2 px-3 rounded-md  text-slate-200 shadow-sm  relative border-opacity-60   focus:border-opacity-100  text-xs border border-info-400 focus:border-info-300 active:border-info-300 bg-slate-700 focus:ring-info-50 sm:text-sm'
                    defaultValue={''}
                    placeholder='Your description'
                  />
                );
              }}
            </Field>
          </div>
          <div className='flex items-center w-full justify-between'>
            <button
              type='button'
              onClick={() => closeModal()}
              className='text-white font-medium flex bg-danger items-center font-display my-3 hover:text-slate-200  py-2 px-6 rounded-full hover:bg-danger-600 transition-colors duration-75 ease-in'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='text-white font-medium flex bg-info-200 items-center font-display my-3 hover:bg-info-300  py-2 px-6 rounded-full hover:border-info-300 transition-colors duration-75 ease-in'
            >
              Create case
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

interface TableProps {
  columns: Array<Column>;
  data: Array<object>;
  fetchData: Function;
  loading: boolean;
  pageCount: number;
  setIsOpen: Function;
}

function Table({ columns, data, fetchData, loading, pageCount: controlledPageCount, setIsOpen }: TableProps) {
  const navigate = useNavigate();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
      manualPagination: true,
      pageCount: controlledPageCount,
    },
    usePagination,
    (hooks) => {
      hooks.allColumns.push((columns) => [
        ...columns,
        {
          accessor: 'edit',
          id: 'edit',
          Header: 'Actions',
          Cell: ({ row, setEditableRowIndex, editableRowIndex }) => (
            <div className='flex items-center justify-between relative z-40'>
              <Link
                // @ts-ignore
                to={`/app/dashboard/${row.original.id}`}
                state={{ activeCase: row.original }}
                className={classNames(
                  'text-info-200 flex items-center justify-between text-sm font-display hover:text-slate-200 border-info-200 border-2 py-1 rounded-full px-3 bg-info-200 hover:border-info-50 transition-colors duration-75 ease-in'
                )}
                replace
              >
                <EyeIcon className='w-5 h-5 text-slate-200 mr-2' />
                <span className='text-slate-200 font-display'>Investigate</span>{' '}
              </Link>
              <button
                className={classNames(
                  'text-danger-500 ml-2 flex items-center justify-between  text-sm font-display hover:text-slate-200 border-danger-500 border-2 py-1 rounded-full px-3 bg-danger-500 hover:border-danger-300 transition-colors duration-75 ease-in'
                )}
              >
                <TrashIcon className='w-5 h-5 text-slate-200 mr-2' />{' '}
                <span className='text-slate-200 font-display flex items-start'>Delete</span>{' '}
              </button>
            </div>
          ),
        },
      ]);
    }
  );

  // Listen for changes in pagination and use the state to fetch our new data
  React.useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [fetchData, pageIndex, pageSize]);

  // Render the UI for your table
  return (
    <>
      <table className='min-w-full divide-y divide-slate-600 table-fixed' {...getTableProps()}>
        <thead className='bg-dark-300 relative'>
          {headerGroups.map((headerGroup: any) => (
            <>
              <tr className='first:bg-dark-400' {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column: any) => (
                  <th
                    className='first:py-3.5 first:pl-4 min-w-min px-3 py-3.5 pr-3 text-left text-sm font-semibold text-slate-200 first:sm:pl-6'
                    {...column.getHeaderProps()}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
              <tr className='right-0 top-0 absolute'>
                <th>
                  <button
                    type='button'
                    onClick={() => console.log('hello', setIsOpen(true))}
                    className='px-1 my-3.5 pr-3 text-left text-sm font-semibold text-info-100 hover:text-info-200 first:sm:pl-6 flex items-center'
                  >
                    <PlusIcon className='mr-2 w-5 h-5 ' /> Create case
                  </button>
                </th>
              </tr>
            </>
          ))}
        </thead>
        <tbody className='bg-dark-300' {...getTableBodyProps()}>
          {page.map((row: any, i: number) => {
            prepareRow(row);
            return (
              <tr className='' {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td
                      className='lg:first:w-32 lg:last:w-72 min-w-min py-2 pl-4 pr-3 text-sm font-medium text-slate-400 sm:pl-6'
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          <tr>
            {loading && (
              // Use our custom loading state to show a loading indicator
              <td className='text-slate-400 pl-6 pb-4' colSpan={10000}>
                Loading...
              </td>
            )}
          </tr>
        </tbody>
      </table>
    </>
  );
}

interface FetchProps {
  pageSize: number;
  pageIndex: number;
}

export const formatDork = (dorkTag: string) => {
  const matches = dorkTag.matchAll(/(\w|\d|\n|[().,\-:;@#$%^&*\[\]"'+–/\/®°⁰!?{}|`~]| )+?(?=(<\/a>))/g);
  const myDork = Array.from(matches);
  if (myDork && myDork[0] && myDork[0][0]) {
    return myDork[0][0];
  }
  return dorkTag;
};

export function CasesTable({ columns, setIsOpen }: { columns: any; setIsOpen: Function }) {
  // We'll start our table without any data
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);

  const fetchData = React.useCallback(({ pageSize, pageIndex }: FetchProps) => {
    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current;

    // Set the loading state
    setLoading(true);

    // Only update the data if this is the latest fetch
    if (fetchId === fetchIdRef.current) {
      casesService
        .getCases(pageIndex, pageSize)
        .then((resp) => {
          if (resp.data) {
            setPageCount(Math.ceil(resp.data.dorksCount / pageSize));
            setData(resp.data);
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch((error) => {
          console.warn(error);
          setLoading(false);
        });
      setLoading(false);
    }
  }, []);

  return (
    <div className='flex flex-col px-8  py-4'>
      <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='inline-block min-w-full py-2 align-middle md:px-6'>
          <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
            <Table
              setIsOpen={setIsOpen}
              columns={columns}
              data={data}
              fetchData={fetchData}
              loading={loading}
              pageCount={pageCount}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const [isFirstLoad, setFirstLoad] = useState<boolean>(true);
  const [casesData, setCasesData] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateCases = (skip: number, limit: number) => {
    casesService
      .getCases(limit, skip)
      .then((resp) => {
        if (resp.data) setCasesData(resp.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isFirstLoad) {
      updateCases(10, 0);
    }
    setFirstLoad(false);
  }, [isFirstLoad]);
  const columns = React.useMemo<Column[]>(
    () => [
      {
        Header: 'ID',
        accessor: 'id',
      },
      {
        Header: 'Cases',
        accessor: 'name',
        Cell: (props): CellValue => props.value || '---',
      },
      {
        Header: 'Description',
        accessor: 'description',
        Cell: (props): CellValue => props.value || '---',
      },
      {
        Header: 'Created',
        accessor: 'created',
        Cell: (props): CellValue => formatDate(new Date(props.value), 'yyyy MMM Lo'),
      },
      //     {
      //   Header: 'Updated',
      //   accessor: 'updated',
      // },
    ],
    []
  );

  api.get('/nodes/').then(resp => {
    console.log('WTF', resp)
  })

  return (
    <>
      <div className='relative mx-auto flex w-full justify-center sm:px-2 lg:px-4 '>
        <div className='min-w-0 max-w-2xl flex-auto pt-4 lg:max-w-none lg:pr-0 px-2'>
          <article>
            <header className=' space-y-1'>
              <p className='font-display text-sm font-medium text-sky-500'>Investigations</p>
              <h1 className='font-display text-3xl tracking-tight text-slate-200 dark:text-white'>All cases</h1>
            </header>
          </article>
        </div>
      </div>
      {casesData.length === 0 ? (
        <div className='w-full flex items-center justify-center'>
          <div className='mt-6 flex flex-col items-center shadow-2xl px-48 bg-dark-300 border border-info-400  rounded-2xl py-20'>
            <FolderPlusIcon className='h-8 w-8 text-slate-300 flex' />
            <h3 className='mt-2 text-2xl text-slate-400 font-medium '>No investigations</h3>
            <p className='mt-1 text-lg text-slate-400'>Get started by creating a new case</p>
            <button
              onClick={() => openModal()}
              type='button'
              className='mt-5 inline-flex items-center rounded-full border border-transparent bg-info-200 px-6 py-2 font-medium text-white shadow-sm hover:bg-info-300 transition-colors duration-75 ease-in-out focus:outline-none focus:ring-2 focus:ring-info-300 focus:ring-offset-2'
            >
              Create case
            </button>
          </div>
        </div>
      ) : (
        <>
          {' '}
          <div className='flex flex-col'>
            <CasesTable setIsOpen={setIsOpen} columns={columns} />
          </div>
        </>
      )}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={() => closeModal()}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center p-2 text-center'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-md bg-dark-300 px-4 pt-4 text-left align-middle shadow-xl transition-all'>
                  <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-slate-300'>
                    Start a new investigation
                  </Dialog.Title>
                  <div className='mt-2'>
                    <p className='text-sm text-slate-400'>
                      An investigation is composed of many connections between data nodes
                    </p>
                  </div>
                  <CreateCasesForm closeModal={closeModal} />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
