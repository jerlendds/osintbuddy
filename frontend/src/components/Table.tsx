import { ChevronLeftIcon, ChevronRightIcon, EyeIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { usePagination, useTable } from 'react-table';
import { ReactComponent as WaterMark } from '@src/assets/images/logo-watermark.svg';
import { toast } from 'react-toastify';
import RoundLoader from './Loaders';

function SkeletonLoader({ className }: any) {
  return (
    <div className={classNames('animate-pulse flex space-x-4', className)}>
      <div className='flex-1 space-y-6 py-1'>
        <div className='h-2 bg-dark-600 rounded'></div>
        <div className='space-y-3'>
          <div className='grid grid-cols-3 gap-4'>
            <div className='h-2 bg-dark-600 rounded col-span-2'></div>
            <div className='h-2 bg-dark-600 rounded col-span-1'></div>
          </div>
          <div className='h-2 bg-dark-600 rounded'></div>
        </div>
      </div>
    </div>
  );
}

export default function Table({
  columns,
  loading,
  data,
  pageCount: controlledPageCount,
  fetchData,
  createButtonFunction,
  createButtonLabel,
  CustomRow,
  emptyTitle,
  emptyDescription,
  DataRow
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
                <table className={classNames('primary-table')} {...getTableProps()}>
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
                        {data.length < columns.length && (
                          <EmptyTableBody
                            showWatermark={data.length === 0}
                            title={
                              data.length === 0 && emptyTitle ? emptyTitle : data.length > 0 ? null : 'No data found'
                            }
                            description={
                              data.length === 0 && emptyDescription
                                ? emptyDescription
                                : data.length > 0
                                  ? null
                                  : 'Get started by creating data'
                            }
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



export function LoadingRow({ columnsLength }: JSONObject) {
  return (
    <tr className='mb-3 '>
      {Array(columnsLength + 1)
        .fill(0)
        .map((_, i) => (
          <td key={i.toString()} className='text-slate-400 px-3 h-10 bg-dark-500 py-3' colSpan={1}>
            <SkeletonLoader className='max-w-sm' />
          </td>
        ))}
    </tr>
  );
}

export function EmptyTableBody({
  columnsLength = 1,
  title = 'No projects found',
  description = 'Get started by creating a new project',
  showWatermark,
}: JSONObject) {
  return (
    <tr className='my-1 empty-body relative'>
      {Array(columnsLength + 1)
        .fill(0)
        .map((_, i) => {
          if (i === 0) {
            return (
              <Fragment key={i.toString()}>
                <td className='relative text-sm text-slate-400 '>
                  <div className=' left-0 z-50 pl-12 invisible hidden min-w-max lg:visible lg:flex flex-col top-0 mb-72'>
                    {title && <h3 className='text-2xl text-slate-300  '>{title}</h3>}
                    {description && <h4 className='mt-1 mb-3 text-lg font-light text-slate-400'>{description}</h4>}
                  </div>
                  {showWatermark && (
                    <WaterMark className=' md:visible invisible hidden md:block absolute h-52 top-5 left-[150%] text-dark-600 mx-auto' />
                  )}
                </td>
              </Fragment>
            );
          }

          return (
            <td key={i.toString()} className='min-w-min relative text-sm text-slate-400 h-[26rem] ml-auto right-0'>
              <div className='flex'>
                <div className=' flex flex-col px-6 py-3'></div>
              </div>
            </td>
          );
        })}
    </tr>
  );
}
