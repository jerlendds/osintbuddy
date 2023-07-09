import React, { useCallback, useRef, useState, Fragment, useEffect } from 'react';
import { useTable, usePagination, type Column, type CellProps, CellValue } from 'react-table';
import dorksService from '@/services/dorks.service';
import classNames from 'classnames';
import { VirusSearchIcon } from '@/components/Icons';
import RoundLoader from '@/components/Loaders';
import {
  BugAntIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  MagnifyingGlassCircleIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import { DorkStats } from './DorkStats';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Listbox, Transition } from '@headlessui/react';
import SelectBoxApi, { SelectBoxOption } from '@/components/SelectBoxApi';
import api from '@/services/api.service';
import { PageHeader } from '@/components/Headers';
import { toast } from 'react-toastify';
import { CreateCaseModal } from '@/routes/projects';
import Table, { DataRow, EmptyTableBody, LoadingRow } from '@/components/Table';

interface TableProps {
  columns: Array<Column>;
  data: Array<object>;
  fetchData: Function;
  loading: boolean;
  pageCount: number;
  setShowCreate: Function;
  setDork: Function;
  CustomRow?: any
}

interface FilterOptions {
  id: number;
  name: string;
  description: string;
}

function TableOld({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  setShowCreate,
  setDork,
  CustomRow
}: TableProps) {
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
          Cell: ({ row, setEditableRowIndex, editableRowIndex }: CellProps<any>) => !CustomRow ? (
            <div className='flex items-center relative z-40'>
               <button
                // @ts-ignore
                className={classNames(
                  'text-info-200 flex items-center justify-between text-sm font-display hover:text-slate-200 border-info-200 border-2 py-1 rounded-full px-3 bg-info-200 hover:border-info-50 transition-colors duration-75 ease-in'
                )}
                onClick={() => {
                  // setDork(row.original.dork);
                  // setShowCreate(true);
                  toast.info('Not implemented. This is coming in a later update...')
                }}
              >
                <MagnifyingGlassCircleIcon className='w-5 h-5 text-slate-200 mr-2' />
                <span className='text-slate-200 font-display'>Add to scans</span>{' '}
              </button>
            </div>
          ) : <CustomRow />,
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
      <table
        className='min-w-full divide-y-2 rounded-t-lg overflow-hidden divide-dark-800 table-auto'
        {...getTableProps()}
      >
        <thead className='bg-dark-300 relative'>
          {headerGroups.map((headerGroup: any) => (
            <tr className='first:bg-dark-400' {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column: any) => (
                <th
                  className='first:py-3.5 min-w-min pr-1.5 py-3.5 text-left text-sm font-semibold text-slate-200 first:sm:pl-6'
                  {...column.getHeaderProps()}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='bg-dark-500' {...getTableBodyProps()}>
          {page.map((row: any, i: number) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td
                      className='whitespace-nowrap truncate lg:first:w-32 lg:last:w-72 min-w-min py-2 pl-4 pr-3 text-sm font-medium text-slate-400 sm:pl-6'
                      {...cell.getCellProps()}
                    >
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <nav
        className='flex items-center bg-dark-500 justify-between border-t border-dark-800 px-4 py-3 sm:px-6'
        aria-label='Pagination'
      >
        <div className='hidden sm:block'>
          <p className='text-sm text-slate-400'>
            {loading ? (
              // Use our custom loading state to show a loading indicator
              <td className='text-slate-400 px-6 py-2' colSpan={10000}>
                <RoundLoader className='text-slate-400' />
              </td>
            ) : (
              <>
                Showing page <span className='font-medium'>{pageIndex + 1}</span> of{' '}
                <span className='font-medium'>{pageOptions.length}</span>
              </>
            )}
          </p>
        </div>
        <div className='flex flex-1 justify-between sm:justify-end'>
   
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            type='button'
            className='text-slate-100 mr-4 flex items-center justify-between text-sm font-display hover:text-slate-200 border-info-200 border-2 py-1 rounded-full px-3 bg-info-200 hover:border-info-50 transition-colors duration-75 ease-in'
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            type='button'
            className='text-slate-100 flex items-center justify-between text-sm font-display hover:text-slate-200 border-info-200 border-2 py-1 rounded-full px-3 bg-info-200 hover:border-info-50 transition-colors duration-75 ease-in'
          >
            Next
          </button>
        </div>
        <select
          className='bg-transparent text-slate-400 ml-20'
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
      </nav>
    </>
  );
}

interface FetchProps {
  pageSize: number;
  pageIndex: number;
}

export const formatDork = (dorkTag: string) => {
  const matches = dorkTag.matchAll(/(\w|\d|\n|[().,\-:;@#$%^&*\[\]"'+–/\/®°⁰!?{}|`~]| )+?(?=(<\/a>))/g);
  return Array.from(matches)[0][0];
};

export default function DorksTable({
  setShowCreate,
  setDork,
  getDorks,
  columns,
  loading,
  data,
  pageCount: controlledPageCount,
  fetchData,
  createButtonFunction,
  createButtonLabel,
  CustomRow,
}: JSONObject) { 
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
            <CustomRow
              updateTable={() => {
                setTimeout(() => fetchData({ pageIndex, pageSize }), 150);
              }}
              row={row}
            />
          ),
        },
      ]);
    }
  );

  useEffect(() => {
    fetchData({ pageIndex, pageSize });
  }, [pageIndex, pageSize]);

  return (
    <>
      <div className='flex flex-col px-8  pb-4 -mt-8'>
        <div className='-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8'>
          <div className='inline-block min-w-full pb-2 align-middle md:px-6'>
            <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>
              {createButtonFunction && (
                <button
                  type='button'
                  onClick={() => createButtonFunction()}
                  className='mb-3.5 ring-1 bg-dark-800 ml-auto pr-3 text-left text-sm font-semibold text-info-100 hover:text-info-200 flex items-center border border-info-200 hover:border-info-300 py-2 px-3 rounded-md mr-1'
                >
                  {createButtonLabel ? createButtonLabel : 'Create'}
                  <PlusIcon className='ml-2 w-5 h-5 ' />
                </button>
              )}
              <div className={classNames('primary-table-wrap', data.length < 4 && 'no-scroll')}>
                <table className='primary-table' {...getTableProps()}>
                  <thead>
                    {headerGroups.map((headerGroup: any, i) => (
                      <tr key={i.toString()} {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column: any) => (
                          <th
                            key={column.Header}
                            className={classNames(column.Header === 'Actions' && 'truncate whitespace-nowrap')}
                            {...column.getHeaderProps()}
                          >
                            {column.render('Header')}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {loading ? (
                      <>
                        <LoadingRow columnsLength={columns.length} />
                        <LoadingRow columnsLength={columns.length} />
                        <LoadingRow columnsLength={columns.length} />
                        <LoadingRow columnsLength={columns.length} />
                      </>
                    ) : (
                      <>
                        {page.map((row: any, i: number) => {
                          prepareRow(row);
                          return <DataRow key={i.toString()} row={row} />;
                        })}
                        {data.length < columns.length + 1 && (
                          <EmptyTableBody
                            showWatermark={data.length === 0}
                            title={data?.length === 0 ? 'No dorks Found' : null}
                            description={data?.length === 0 ? 'Please wait for the dorks scrape to complete' : null}
                            columnsLength={columns.length}
                          />
                        )}
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              <nav
                className='flex items-center bg-dark-500 justify-end border-t border-dark-800 px-4 py-3 sm:px-6'
                aria-label='Pagination'
              >
                <div className='hidden sm:block mr-auto'>
                  <div className='text-sm text-slate-400'>
                    {loading ? (
                      // Use our custom loading state to show a loading indicator
                      <div className='text-slate-400 px-6 py-2'>
                        <RoundLoader className='text-slate-400' />
                      </div>
                    ) : (
                      <>
                        Showing page <span className='font-medium'>{pageIndex + 1}</span> of{' '}
                        <span className='font-medium'>{pageOptions.length === 0 ? 1 : pageOptions.length}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className='flex  max-w-sm '>
                  <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                    className='flex whitespace-nowrap ml-4 mr-auto px-2 py-2 disabled:hover:ring-1 disabled:hover:text-slate-600 hover:ring-2 ring-slate-600 focus:ring-1 focus:ring-inset outline-none items-center text-slate-600 hover:text-slate-400 rounded-md ring-1 '
                  >
                    <ChevronLeftIcon className='w-5 h-5 text-slate-400 mr-2' /> <span className='mx-2'>Previous</span>
                  </button>
                  <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className='flex whitespace-nowrap ml-4 mr-auto px-2 py-2 disabled:hover:ring-1 disabled:hover:text-slate-600 hover:ring-2 ring-slate-600 focus:ring-1 focus:ring-inset outline-none items-center text-slate-600 hover:text-slate-400 rounded-md ring-1 '
                  >
                    <span className='mx-2'>Next</span>
                    <ChevronRightIcon className='w-5 h-5 text-slate-400 mr-2' />{' '}
                  </button>
                </div>
                <select
                  className='bg-transparent text-slate-400 ml-4'
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
              </nav>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

