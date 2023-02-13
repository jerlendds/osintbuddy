import { useState } from 'react';
import { Position, Handle } from 'reactflow';
import { Column, useTable } from 'react-table';
import { GripIcon, IpIcon } from '@/components/Icons';
import { NodeContextProps, Result, Welcome } from '.';
import api from '@/services/api.service';
import { capitalize } from '../OsintPage';


interface Data extends Welcome {
  domain?: string;
}

export function UrlScanNode({ flowData, deleteNode }: any) {
  const [data, setData] = useState<Data>(flowData.data);
  const handleSubmit = (event: any) => {
    event.preventDefault();
  };

  function Table({ columns, data }: any) {
    // Use the state and functions returned from useTable to build your UI
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
      // @ts-ignore
      columns,
      data,
    });

    // Render the UI for your table
    return (
      <div className='overflow-x w-[64rem] h-64 min-w-full'>
        <table align='left' className='overflow-scroll w-[64rem] block  h-64' {...getTableProps()}>
          <thead className=''>
            {headerGroups.map((headerGroup) => (
              <tr
                className='border-b border-dark-200 leading-4 tracking-wider text-base text-gray-900'
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column) => (
                  <th className='px-6 py-5 text-left' {...column.getHeaderProps()}>
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  className='border-b border-dark-200 leading-4 tracking-wider text-base text-gray-900'
                  {...row.getRowProps()}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        className='font-display text-[0.75rem] h-10  w-full align-left break-words pl-6 max-w-sm'
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
      </div>
    );
  }

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className=' flex flex-col min-w-6xl w-[65rem] justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-primary text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>urlscan.io</p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display'>
              <span className='text-xs text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
          </div>
          <IpIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full h-full p-2'>
          <div className='md:flex-col md:flex w-full h-full md:flex-1  md:justify-between '>
            <form onSubmit={(event) => handleSubmit(event)} className='flex items-start flex-col max-w-2xl h-full'>
              <>
                <p className='text-xs ml-2 mb-3  font-semibold text-gray-400  whitespace-wrap font-display'>
                  Running URL scan for{' '}
                  <span className='text-base font-semibold text-gray-400  whitespace-wrap font-display '>
                    {data.domain}
                  </span>
                </p>
                {data.results.length > 0 ? (
                  <Table
                    columns={Object.keys(data.results[0].page).map((columnName) => {
                      return { Header: capitalize(columnName), accessor: columnName };
                    })}
                    data={data.results.map((result: Result) => {
                      return { ...result.page };
                    })}
                  />
                ) : (
                  <>
                    <p className='text-xs font-display'>No results</p>
                  </>
                )}
              </>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function UrlScanNodeContext({
  node,
  reactFlowInstance,
  addNode,
  addEdge,
  nodeData,
  nodeType,
  parentId,
  getId,
}: NodeContextProps) {
  return <></>;
}
