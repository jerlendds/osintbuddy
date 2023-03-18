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
} from '@heroicons/react/24/outline';
import { DorkStats } from './DorkStats';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Listbox, Transition } from '@headlessui/react';
import SelectBoxApi, { SelectBoxOption } from '@/components/SelectBoxApi';
import api from '@/services/api.service';

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

interface FilterOptions {
  id: number;
  name: string;
  description: string;
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
                  'text-primary-600 flex bg-info-200 items-center font-light text-sm hover:text-light-200  py-1.5 px-4 border border-info-200 hover:border-opacity-20 hover:border-info-50 rounded-full transition-colors duration-75 ease-in'
                )}
                onClick={() => {
                  setDork(row.original.dork);
                  setShowCreate(true);
                }}
              >
                <span className='text-slate-200 mr-2 font-medium font-display'>Start crawl</span>{' '}
                <BugAntIcon className='w-5 h-5 text-slate-200' />
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
          ))}
        </thead>
        <tbody className='bg-dark-300' {...getTableBodyProps()}>
          {page.map((row: any, i: number) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell: any) => {
                  return (
                    <td
                      className='whitespace-nowrap py-2 pl-4 max-w-sm pr-3 truncate text-sm font-medium text-slate-400 sm:pl-6 first:pl-8'
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
        className='flex items-center bg-dark-400 justify-between border-t border-gray-200 px-4 py-3 sm:px-6'
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
            className='text-slate-100 mr-12 flex items-center justify-between text-sm font-display hover:text-slate-200 border-info-200 border-2 py-1 rounded-full px-3 bg-info-200 hover:border-info-50 transition-colors duration-75 ease-in'
            onClick={() => updateGhdb()}
          >
            Fetch dorks
          </button>
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
  columns,
  updateGhdb,
}: {
  setShowCreate: Function;
  setDork: Function;
  columns: Column[];
  updateGhdb: Function;
}) {
  const [isLoadingFilter, setIsLoadingFilter] = useState<boolean>(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions[] | []>([]);
  const [selectedFilter, setSelectedFilter] = useState<SelectBoxOption>({
    id: -1,
    name: 'Select a category...',
  });

  useEffect(() => {
    setIsLoadingFilter(true);
    api
      .get('/ghdb/categories/')
      .then((resp) => {
        if (resp.data) {
          setFilterOptions([
            {
              id: -1,
              name: 'All',
            },
            ...resp.data,
          ]);
        }
        setIsLoadingFilter(false);
      })
      .catch((error) => {
        console.warn(error);
        setIsLoadingFilter(false);
      });
  }, []);

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

        let dorkFilter = selectedFilter.id


        dorksService
          .getDorks(pageSize, pageIndex, dorkFilter)
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
  }, [selectedFilter]);

  return (
    <div className=' flex flex-col '>
      <div className=''>
        <div className='flex items-end'>
          <div className='flex flex-col min-w-[20rem] z-50 pb-1 mr-4'>
            <SelectBoxApi
              setSelected={setSelectedFilter}
              selected={selectedFilter}
              loading={isLoadingFilter}
              label='Filter Categories'
              options={filterOptions}
            />
          </div>
          <DorkStats />
        </div>
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
