import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import { Position, Handle } from 'reactflow';
import { Column, useTable } from 'react-table';
import { GripIcon, IpIcon } from '@/components/Icons';
import { NodeContextProps, NodeId } from '.';
import api from '@/services/api.service';
import { capitalize } from '../OsintPage';
import { ReactECharts } from '@/components/ReactEcharts';

let nodeId = 0;

export function TracerouteNode({ flowData, deleteNode }: any) {
  const [data, setData] = useState(flowData.data);
  const handleSubmit = (event: any) => {
    event.preventDefault();
  };
  console.log(
    data.data.map((elm: any) => elm.hop),
    data.data
  );
  const chartRef = useRef(null);
  var option: echarts.EChartsOption = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'line',
        symbol: 'triangle',
        symbolSize: 20,
        lineStyle: {
          color: '#5470C6',
          width: 4,
          type: 'dashed',
        },
        itemStyle: {
          borderWidth: 3,
          borderColor: '#EE6666',
          color: 'yellow',
        },
      },
    ],
  };

  console.log('chartRef', chartRef);
  function Table({ columns, data }: any) {
    // Use the state and functions returned from useTable to build your UI
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
      // @ts-ignore
      columns,
      data,
    });

    // Render the UI for your table
    return (
      <table align='left' className='w-full' {...getTableProps()}>
        <thead className=''>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th className='font-display text-xs' {...column.getHeaderProps()}>
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
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td className='font-display text-[0.75rem]' {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
  return (
    <>
      {/* <ReactECharts option={option} /> */}
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className=' flex flex-col w-[58rem] max-w-4xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-primary text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>Traceroute</p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display'>
              <span className='text-xs text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
          </div>
          <IpIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form onSubmit={(event) => handleSubmit(event)} className='flex items-start flex-col'>
              <>
                <p className='text-xs ml-2 mb-3  font-semibold text-gray-400  whitespace-wrap font-display'>
                  Running traceroute for{' '}
                  <span className='text-base font-semibold text-gray-400  whitespace-wrap font-display'>
                    {data.meta.url}
                  </span>
                </p>
                <div ref={chartRef}></div>
                <Table
                  columns={Object.keys(data.data[0]).map((columnName) => {
                    return { Header: capitalize(columnName), accessor: columnName };
                  })}
                  data={data.data}
                />
                {/* {data.data &&
                  data.data.map((hop: {
                    asn: string;
                    avg: number;
                    best: number;
                    hop: number;
                    host: string;
                    last: number;
                    loss: number;
                    sent: number;
                    stdDev: number;
                    worst: number;
                  }) => {
                    return (
                      <>
                        <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                          Testing
                        </p>{' '}
                        <div className='flex items-center mb-1'>
                          <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                            <IpIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                            <p
                              data-type='domain'
                              className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-40 bg-light-200 focus:bg-light-50'
                            >
                              {}
                            </p>
                          </div>
                        </div>
                      </>
                    );
                  })} */}
              </>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function TracerouteNodeContext({
  node,
  reactFlowInstance,
  addNode,
  addEdge,
  nodeData,
  nodeType,
  parentId,
}: NodeContextProps) {
  const getId = (): NodeId => {
    nodeId++;
    return `n_${nodeId}`;
  };

  return <></>;
}
