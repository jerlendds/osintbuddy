import React, { useCallback, useRef, useState } from 'react';
import { useTable, usePagination, type Column, type CellProps, CellValue } from 'react-table';
import dorksService from '@/services/dorks.service';
import classNames from 'classnames';
import { VirusSearchIcon } from '@/components/Icons';
import RoundLoader from '@/components/Loaders';
import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { DorkStats } from './DorkStats';

interface TableProps {
  columns: Array<Column>;
  data: Array<object>;
  fetchData: Function;
  loading: boolean;
  pageCount: number;
  setShowCreate: Function;
  setDork: Function;
  updateGhdb: Function;
}

function Table({
  columns,
  data,
  fetchData,
  loading,
  pageCount: controlledPageCount,
  setShowCreate,
  setDork,
  updateGhdb,
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
          Cell: ({ row, setEditableRowIndex, editableRowIndex }: CellProps<any>) => (
            <div className='flex items-center relative z-40'>
              <button
                className={classNames(
                  'text-primary-600 flex bg-lime-700 items-center font-light text-sm font-display hover:text-light-200 border-lime-700 border-2 py-2 px-4 rounded-full hover:border-primary-400 transition-colors duration-75 ease-in'
                )}
                onClick={() => {
                  setDork(row.original.dork);
                  setShowCreate(true);
                }}
              >
                <span className='text-light-200 mx-2 mr-4 font-sans font-medium'>Start crawl</span>{' '}
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
              <td className='text-light-900 px-6 py-2' colSpan={10000}>
                <RoundLoader />
              </td>
            ) : (
              <td className='text-light-900 px-6 py-1' colSpan={10000}>
                   <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
              </td>
            )}
          </tr>
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className='flex'>
            <button
            className='flex max-w-xs items-center border border-transparent bg-lime-700 px-4 py-1 h-10 my-auto mr-4 text-sm font-medium text-white shadow-sm hover:bg-lime-700 focus:outline-none focus:ring-2 focus:ring-lime-600 focus:ring-offset-2'
            onClick={() => updateGhdb()}
          >
            Update dorks
          </button> 
        <button
          className='border-2 border-lime-700 hover:border-lime-600 bg-lime-700 mr-1.5 my-2 rounded-lg px-5 py-1.5'
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <ChevronDoubleLeftIcon className='text-white w-6 h-6' />
        </button>{' '}
        <button
          className='border-2 border-lime-700 hover:border-lime-600 bg-lime-700 mx-1.5 my-2 rounded-lg px-5 py-1.5'
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <ChevronLeftIcon className='text-white w-6 h-6' />
        </button>{' '}
        <button
          className='border-2 border-lime-700 hover:border-lime-600 bg-lime-700 mx-1.5 my-2 rounded-lg px-5 py-1.5'
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <ChevronRightIcon className='text-white w-6 h-6' />
        </button>{' '}
        <button
          className='border-2 border-lime-700 hover:border-lime-600 bg-lime-700 mx-1.5 my-2 rounded-lg px-5 py-1.5'
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <ChevronDoubleRightIcon className='text-white w-6 h-6' />
        </button>{' '}

        
        <span>
         Go to page:{' '}
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
  return Array.from(matches)[0][0];
};

export default function DorksTable({
  setShowCreate,
  setDork,
  columns,
  updateGhdb
}: {
  setShowCreate: Function;
  setDork: Function;
  columns: Column[];
  updateGhdb: Function;
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const fetchIdRef = useRef(0);

  // fetch the dorks data
  const fetchData = useCallback(({ pageSize, pageIndex }: FetchProps) => {
    const fetchId = ++fetchIdRef.current;
    setLoading(true);
    setTimeout(() => {
      if (fetchId === fetchIdRef.current) {
        const startRow = pageSize * pageIndex;
        const endRow = startRow + pageSize;

        dorksService
          .getDorks(pageSize, pageIndex)
          .then((resp) => {
            if (resp.data) {
              if (resp.data.dorks) {
                setPageCount(Math.ceil(resp.data.dorksCount / pageSize));
                setData(resp.data.dorks);
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
    <div className=' flex flex-col '>
      <div className=''>
            <DorkStats />
        <div className='inline-block min-w-full py-2 align-middle '>

          <div className='overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg'>

            <Table
            updateGhdb={updateGhdb}
              setDork={setDork}
              setShowCreate={setShowCreate}
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
