import casesService from '@/services/cases.service';
import { FolderPlusIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

import React from 'react';
import { useTable, usePagination, type Column, type CellProps, CellValue } from 'react-table';
import dorksService from '@/services/dorks.service';
import classNames from 'classnames';
import { VirusSearchIcon } from '@/components/Icons';

import { Formik, Form, Field } from 'formik';

interface MyFormValues {
  name: string;
  description: string;
}

export const MyForm: React.FC<{}> = () => {
  const initialValues: MyFormValues = { name: '', description: '' };

  return (
    <div>
      <h1 className='text-2xl'>Start a new OSINT case</h1>
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
          alert(JSON.stringify(values, null, 2));
          actions.setSubmitting(false);
        }}
      >
        <Form className='flex flex-col my-5'>
          <div className='py-2'>
            <label className='block text-lg font-medium text-light-700' htmlFor='name'>
              Case name
            </label>
            <Field
              className='block w-full py-2 px-3 rounded-sm bg-dark-500 text-light-50 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 '
              id='name'
              name='name'
              placeholder='Your name'
            />
          </div>
          <div className='py-2'>
            <label className='block text-lg font-medium text-light-700' htmlFor='description'>
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
                    className='block w-full py-2 px-3 text-lg rounded-sm bg-dark-500 text-light-50 border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 '
                    defaultValue={''}
                  />
                );
              }}
            </Field>
          </div>

          <button
            type='submit'
            className='text-light-600 font-medium flex bg-primary items-center font-display text-sm my-3 hover:text-light-200 border-primary border-2 py-2 px-4 rounded-full hover:border-primary-400 transition-colors duration-75 ease-in'
          >
            Create case
          </button>
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
    // Get the state from the instance
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 }, // Pass our hoisted table state
      manualPagination: true, // Tell the usePagination
      // hook that we'll handle our own data fetching
      // This means we'll also have to provide our own
      // pageCount.
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
              <button
                className={classNames(
                  'text-primary-600 flex bg-primary items-center font-light text-sm font-display hover:text-light-200 border-primary border-2 py-2 px-4 rounded-full hover:border-primary-400 transition-colors duration-75 ease-in'
                )}
                onClick={() => {}}
              >
                <span className='text-light-200 mx-2 mr-4 font-sans font-medium'>View case</span>{' '}
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
      <table className='min-w-full divide-y divide-dark-300' {...getTableProps()}>
        <thead className='bg-dark-800'>
          {headerGroups.map((headerGroup: any) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th
                  className='first:py-3.5 first:pl-4 px-3 py-3.5 pr-3 text-left text-sm font-semibold text-light-900 first:sm:pl-6 '
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='bg-dark-700' {...getTableBodyProps()}>
          {page.map((row: any, i: number) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td
                      className='whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-50 sm:pl-6'
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
            {loading ? (
              // Use our custom loading state to show a loading indicator
              <td colSpan={10000}>Loading...</td>
            ) : (
              <td colSpan={10000}>
                Showing {page.length} of ~{controlledPageCount * pageSize} results
              </td>
            )}
          </tr>
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className='pagination'>
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
            {pageIndex + 1} of {pageOptions.length}
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
    <div className='mt-8 flex flex-col '>
      <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
        <div className='inline-block min-w-full py-2 align-middle md:px-6 lg:px-8'>
          <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
            <Table columns={columns} data={data} fetchData={fetchData} loading={loading} pageCount={pageCount} />;
          </div>
        </div>
      </div>
    </div>
  );
}

const CasesCard = ({ toggleShowCreate }: { toggleShowCreate: Function }): React.ReactElement => {
  const [isFirstLoad, setFirstLoad] = useState<boolean>(true);
  const [casesData, setCasesData] = useState([]);
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
      },
    ],
    []
  );
  return (
    <div className='w-full flex items-center justify-center h-full px-4 pb-20'>
      {casesData.length === 0 && (
        <div className='text-center'>
          <div className='mt-6 flex flex-col items-center'>
            <FolderPlusIcon className='h-8 w-8 text-light flex' />
            <h3 className='mt-2 text-2xl font-medium text-light-900'>No projects</h3>
            <p className='mt-1 text-lg  text-light-900'>Get started by creating a new project.</p>
            <button
              onClick={() => toggleShowCreate()}
              type='button'
              className='mt-5 inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-600 transition-colors duration-75 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
            >
              <PlusIcon className='-ml-1 mr-2 h-5 w-5' aria-hidden='true' />
              New Project
            </button>
          </div>
        </div>
      )}
      {casesData.length > 0 && (
        <>
          <CasesTable columns={columns} />
        </>
      )}
    </div>
  );
};

export default function DashboardPage() {
  const [showCreate, setShowCreate] = useState(false);

  const toggleShowCreate = () => {
    setShowCreate(!showCreate);
  };

  return (
    <>
      <CasesCard toggleShowCreate={toggleShowCreate} />
      <div
        className={classNames(
          'h-full flex flex-col absolute right-0 w-1/3 bg-dark-700 top-0 transition-transform  py-16',
          {
            'translate-x-[50rem]': !showCreate,
          }
        )}
      >
        <div className='py-4 px-5'>
          <MyForm />
        </div>
      </div>
    </>
  );
}
