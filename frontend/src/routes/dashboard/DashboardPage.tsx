import casesService from '@/services/cases.service';
import { FolderPlusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { useTable, usePagination, type Column, type CellProps, CellValue } from 'react-table';
import dorksService from '@/services/dorks.service';
import classNames from 'classnames';
import { format as formatDate } from 'date-fns';

import { Formik, Form, Field } from 'formik';
import { Link, useNavigate } from 'react-router-dom';

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
            <label className='block text-dark-700' htmlFor='name'>
              Case name
            </label>
            <Field
              className='block w-full py-2 px-3 rounded-md bg-light-100 text-dark-500 border-2 border-dark-100 shadow-sm text-sm focus:border-dark-500 focus:ring-indigo-500'
              id='name'
              name='name'
              placeholder='Your name'
            />
          </div>
          <div className='py-2'>
            <label className='block text-dark-700' htmlFor='description'>
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
                    className='block w-full py-2 px-3 text-sm rounded-md bg-light-100 text-dark-500 border-2 border-dark-100 shadow-sm  '
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
              className='text-white font-semibold flex bg-danger items-center font-display my-3 hover:text-light-200  py-2 px-4 rounded-md hover:bg-danger-600 transition-colors duration-75 ease-in'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='text-white font-semibold flex bg-primary items-center font-display my-3 hover:bg-primary-600  py-2 px-4 rounded-md hover:border-primary-400 transition-colors duration-75 ease-in'
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
}

function Table({ columns, data, fetchData, loading, pageCount: controlledPageCount }: TableProps) {
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
            <div className='flex items-center relative z-40'>
              <Link
                // @ts-ignore
                to={`/app/osint/${row.original.id}`}
                state={{ activeCase: row.original }}
                className={classNames(
                  'text-primary-600 flex bg-primary items-center  text-sm font-display hover:text-light-200 border-primary border-2 py-2 px-4 rounded-md hover:border-primary-400 transition-colors duration-75 ease-in'
                )}
                replace
              >
                <span className='text-light-200 mx-2 mr-4 font-display font-medium'>View case</span>{' '}
              </Link>
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
      <table className='min-w-full divide-y divide-light-300' {...getTableProps()}>
        <thead className='bg-light-300'>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th
                  className='first:py-3.5 first:pl-4 px-3 py-3.5 pr-3 text-left text-sm font-semibold text-dark-900 first:sm:pl-6'
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='bg-light-300' {...getTableBodyProps()}>
          {page.map((row: any, i: number) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td
                      className='whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-dark-400 sm:pl-6'
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
              <td colSpan={10000}>Loading...</td>
            )}
          </tr>
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className='pagination bg-light-300 py-3'>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {'<<'}
        </button>{' '}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {'<'}
        </button>{' '}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {'>'}
        </button>{' '}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {'>>'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length + 1}
          </strong>{' '}
        </span>
        <span>
          | Go to page:{' '}
          <input
            type='number'
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: '100px' }}
          />
        </span>{' '}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
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

export function CasesTable({ columns }: { columns: any }) {
  // We'll start our table without any data
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [pageCount, setPageCount] = React.useState(0);
  const fetchIdRef = React.useRef(0);

  const fetchData = React.useCallback(({ pageSize, pageIndex }: FetchProps) => {
    // This will get called when the table needs new data
    // You could fetch your data from literally anywhere,
    // even a server. But for this example, we'll just fake it.

    // Give this fetch an ID
    const fetchId = ++fetchIdRef.current;

    // Set the loading state
    setLoading(true);

    // We'll even set a delay to simulate a server here
    setTimeout(() => {
      // Only update the data if this is the latest fetch
      if (fetchId === fetchIdRef.current) {
        casesService
          .getCases(pageIndex, pageSize)
          .then((resp) => {
            if (resp.data) {
              console.log(resp.data);
              if (resp.data) {
                setPageCount(Math.ceil(resp.data.dorksCount / pageSize));
                setData(resp.data);
              }
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
    }, 1000);
  }, []);

  return (
    <div className='flex flex-col px-8  py-4'>
      <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='inline-block min-w-full py-2 align-middle md:px-6'>
          <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
            <Table columns={columns} data={data} fetchData={fetchData} loading={loading} pageCount={pageCount} />
          </div>
        </div>
      </div>
    </div>
  );
}

const CasesCards = ({
  closeModal,
  openModal,
  isModalOpen,
}: {
  isModalOpen: boolean;
  closeModal: Function;
  openModal: Function;
}): React.ReactElement => {
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
        Header: 'Case id',
        accessor: 'id',
      },
      {
        Header: 'Cases',
        accessor: 'name',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'Created',
        accessor: 'created',
        Cell: (props): CellValue => formatDate(new Date(props.value), 'yyyy MMM Lo k:m'),
      },
      //     {
      //   Header: 'Updated',
      //   accessor: 'updated',
      // },
    ],
    []
  );
  return (
    <>
      <div className='w-full flex items-center justify-center h-full pb-20'>
        {casesData.length === 0 && (
          <>
            <div className='mt-6 flex flex-col items-center shadow-2xl px-48 bg-light-500 border-primary border-2 rounded-2xl py-20'>
              <FolderPlusIcon className='h-8 w-8 text-light flex' />
              <h3 className='mt-2 text-2xl font-medium '>No investigations</h3>
              <p className='mt-1 text-lg'>Get started by creating a new case</p>
              <button
                onClick={() => openModal()}
                type='button'
                className='mt-5 inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-lg font-medium text-white shadow-sm hover:bg-primary-600 transition-colors duration-75 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
              >
                Start case
              </button>
            </div>
            <Transition appear show={isModalOpen} as={Fragment}>
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
                  <div className='flex min-h-full items-center justify-center p-4 text-center'>
                    <Transition.Child
                      as={Fragment}
                      enter='ease-out duration-300'
                      enterFrom='opacity-0 scale-95'
                      enterTo='opacity-100 scale-100'
                      leave='ease-in duration-200'
                      leaveFrom='opacity-100 scale-100'
                      leaveTo='opacity-0 scale-95'
                    >
                      <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                        <Dialog.Title as='h3' className='text-lg font-medium leading-6 text-gray-900'>
                          Start a new investigation
                        </Dialog.Title>
                        <div className='mt-2'>
                          <p className='text-sm text-gray-500'>
                            An investigation can be composed of many connections between search results
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
        )}
      </div>
      <div className='flex flex-col space-y-2'>
        <CasesTable columns={columns} />
      </div>
    </>
  );
};

export default function DashboardPage() {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <CasesCards isModalOpen={isOpen} closeModal={closeModal} openModal={openModal} />
    </>
  );
}
