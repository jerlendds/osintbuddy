import { GoogleIcon, GripIcon, IpIcon, WebsiteIcon } from '@/components/Icons';
import { Handle, Position } from 'reactflow';
import api from '@/services/api.service';
import { Combobox, Menu, Transition } from '@headlessui/react';
import {
  ArchiveBoxIcon,
  ArrowRightCircleIcon,
  ChevronUpDownIcon,
  ClipboardIcon,
  ComputerDesktopIcon,
  DocumentDuplicateIcon,
  DocumentIcon,
  FolderOpenIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  PaperClipIcon,
  PencilSquareIcon,
  ServerIcon,
  TrashIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import classNames from 'classnames';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { parseCronExpression } from 'cron-schedule';
import { IntervalBasedCronScheduler } from 'cron-schedule';
import axios from 'axios';
import mock from '../data.json';
import { toast } from 'react-toastify';
import ContextMenu from './ContextMenu';
import { ReactECharts } from '@/components/ReactEcharts';
import RoundLoader from '@/components/Loaders';

export const TargetHandleCombo = () => {
  const handleStyle = { background: '#fff', borderColor: 'rgb(33 129 181)', borderRadius: 500, width: 4, height: 4 };
  return (
    <>
      <Handle position={Position.Left} id='l1' key='l1' type='target' style={handleStyle} />
      <Handle position={Position.Right} id='r1' key='r1' type='target' style={handleStyle} />
      <Handle position={Position.Top} id='t1' key='t1' type='target' style={handleStyle} />
      <Handle position={Position.Bottom} id='b1' key='b1' type='target' style={handleStyle} />
    </>
  );
};

export const SourceHandleCombo = () => {
  const handleStyle = { background: '#fff', borderColor: 'rgb(33 129 181)', borderRadius: 500, width: 4, height: 4 };
  return (
    <>
      <Handle position={Position.Left} id='l1' key='l1' type='source' style={handleStyle} />
      <Handle position={Position.Right} id='r1' key='r1' type='source' style={handleStyle} />
      <Handle position={Position.Top} id='t1' key='t1' type='source' style={handleStyle} />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' style={handleStyle} />
    </>
  );
};

let googleId = 0;
export const getGoogleId = () => `rnode_${googleId++}`;

export function GoogleNode({
  addNode,
  flowData,
  isConnectable,
  addEdge,
  bounds,
  reactFlowInstance,
}: {
  addNode: Function;
  flowData: any;
  isConnectable: any;
  addEdge: Function;
  bounds: any;
  reactFlowInstance: any;
}) {
  const [queryValue, setQueryValue] = useState<string>('');
  const [pagesValue, setPagesValue] = useState<number>(3);
  let newPos = { x: 0, y: 0 };
  console.log('rf bounds', bounds);

  console.log('flowData.xPos, flowData.yPos', flowData.xPos, flowData.yPos);
  const handleSubmit = (event: any) => {
    event.preventDefault();
    api
      .get(`/ghdb/dorks/crawl?query=${queryValue}&pages=${pagesValue}`)
      .then((resp) => {
        let idx = 0;
        for (const [resultType, results] of Object.entries(resp.data)) {
          idx += 1;
          if (results) {
            let newNode: any = null;
            // @ts-ignore

            results.forEach((result, rIdx) => {
              const pos = {
                x: flowData.xPos + 260,
                y: !newNode ? rIdx * result.description.length + 300 : newNode.y + 200,
              };
              const nodeId = getGoogleId();
              console.log('newNode', newNode);
              newNode = addNode(
                nodeId,
                'result',
                {
                  x: rIdx % 2 === 0 ? flowData.xPos + 420 : flowData.xPos + 1130,
                  // y: rIdx % 2 === 0 ? (totalLines * 22)  : ((totalLines - rIdx) * 22) ,
                  y:
                    rIdx % 2 === 0
                      ? rIdx * 60 - flowData.yPos + Math.ceil(result.description.length / 60) * 50
                      : (rIdx - 1) * 60 - flowData.yPos + Math.ceil(result.description.length / 60) * 50,
                },
                {
                  label: result,
                }
              );
              addEdge(flowData.id, nodeId);
              console.log(nodeId, result.description.length, newNode, pos);
            });
          }
        }
      })
      .catch((error) => {
        console.warn(error);
      });
  };
  const validateConn = () => {
    console.log('validate connn');
    return true;
  };
  return (
    <>
      <SourceHandleCombo />
      <div className=' flex flex-col w-full max-w-sm justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-info-300 text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>Google Search</p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display'>
              <span className='text-xs text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
          </div>
          <GoogleIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form onSubmit={(event) => handleSubmit(event)} className='flex items-start flex-col'>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>Query</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1 w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <MagnifyingGlassIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                  <input
                    data-type='query'
                    type='text'
                    onChange={(event: any) => setQueryValue(event.target.value)}
                    value={queryValue}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-full bg-light-200 focus:bg-light-50'
                    placeholder='Search...'
                  />
                </div>
              </div>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display mt-1'>
                Total pages
              </p>
              <div className='flex items-center mb-1'>
                <div className='mt-1 w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <DocumentIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                  <input
                    data-type='pages'
                    type='number'
                    onChange={(event: any) => setPagesValue(event.target.value)}
                    value={pagesValue}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-full bg-light-200 focus:bg-light-50'
                    placeholder='HTTP 403'
                  />
                </div>
              </div>

              <button
                type='submit'
                className='flex w-full mt-2 py-2 ml-auto items-center bg-info-200 rounded-full justify-between px-3'
              >
                <p className=' text-xs font-semibold font-display flex text-white whitespace-nowrap'>Search Google</p>
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

const cseData = [
  { url: -1, title: 'All', description: 'Run a search through all the CSE links' },
  // More users...
];

export function CseNode({ flowData }: any) {
  const isMounted = useRef(false);
  const [query, setQuery] = useState('');
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [activeCseData, setActiveCseData] = useState([]);
  const [cseData, setCseData] = useState([]);

  const getCseLinks = useCallback(() => {
    api
      .get('/cses/links')
      .then((resp) => {
        console.log(resp);
        setCseData(resp.data);
      })
      .catch((error) => {
        console.warn(error);
      });
  }, [cseData]);
  const filteredCseOptions =
    query === ''
      ? cseData
      : cseData.filter((cseOption: any) => {
          return cseOption.title.toLowerCase().includes(query.toLowerCase());
        });
  useEffect(() => {
    if (isMounted.current) {
      console.log('fetching');
    } else {
      isMounted.current = true;
      getCseLinks();
    }
  }, [isMounted]);
  return (
    <>
      <div className=' flex flex-col w-[30rem] max-w-2xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-info-400 text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>DNS</p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display'>
              <span className='text-xs text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
          </div>
          <IpIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              <>
                <>
                  <div className='flex'>
                    <div className='flex flex-col'>
                      <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                        Query
                      </p>
                      <div className='flex items-center mb-1 mr-4'>
                        <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                          <MagnifyingGlassIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                          <input
                            type='text'
                            data-type='query'
                            onChange={(event: any) => null}
                            value={''}
                            className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-80 bg-light-200 focus:bg-light-50'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col'>
                      <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                        Pages
                      </p>
                      <div className='flex items-center mb-1'>
                        <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                          <MagnifyingGlassIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                          <input
                            type='number'
                            data-type='pages'
                            onChange={(event: any) => null}
                            value={3}
                            className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-20 bg-light-200 focus:bg-light-50'
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Combobox className='w-full' as='div' value={selectedPerson} onChange={setSelectedPerson}>
                    <Combobox.Label>
                      <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display mt-4'>
                        CSE Categories
                      </p>
                    </Combobox.Label>
                    <div className='relative mt-1'>
                      <Combobox.Input
                        className='mt-1 outline-none w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(person: any) => person?.title}
                      />
                      <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
                        <ChevronUpDownIcon className='h-5 w-5 text-gray-400' aria-hidden='true' />
                      </Combobox.Button>

                      {filteredCseOptions.length > 0 && (
                        <Combobox.Options className='absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-md bg-light-200 py-1 text-base shadow-lg ring-1 ring-gray-200 ring-opacity-5 focus:outline-none sm:text-sm'>
                          {filteredCseOptions.map((cseOption: any) => (
                            <>
                              <Combobox.Option
                                // @ts-ignore
                                onClick={() => setActiveCseData([...activeCseData, cseOption])}
                                key={cseOption.url}
                                value={cseOption}
                                className={({ active }) =>
                                  classNames(
                                    'relative cursor-default select-none py-2 pl-3 pr-9 ',
                                    active ? 'bg-light-400 text-white' : 'text-gray-900'
                                  )
                                }
                              >
                                {({ active, selected }) => (
                                  <>
                                    {cseOption.description !== cseOption.title && (
                                      <span className={classNames('block font-display truncate font-semibold pl-3')}>
                                        {cseOption.title}
                                      </span>
                                    )}

                                    {activeCseData &&
                                      activeCseData.map(() => {
                                        return (
                                          <div className='relative  flex items-start'>
                                            <div className='ml-3 text-sm'>
                                              <p className='text-gray-500 font-display'>{cseOption.description}</p>
                                            </div>
                                          </div>
                                        );
                                      })}
                                  </>
                                )}
                              </Combobox.Option>
                            </>
                          ))}
                        </Combobox.Options>
                      )}
                    </div>
                  </Combobox>
                </>
              </>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export function DomainNode({ flowData }: any) {
  const [domainValue, setDomainValue] = useState<string>(flowData.data?.label.domain);

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className=' flex flex-col w-72 max-w-2xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-persian text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>Domain</p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display'>
              <span className='text-xs text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
          </div>
          <WebsiteIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>URL</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <MagnifyingGlassIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    onChange={(event: any) => setDomainValue(event.target.value)}
                    value={domainValue}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='www.google.com'
                  />
                  <input
                    type='text'
                    className='hidden'
                    onChange={() => null}
                    value={flowData.data.label?.origin && flowData.data.label.origin}
                    data-type='origin'
                  />
                  <input
                    type='text'
                    onChange={() => null}
                    className='hidden'
                    value={flowData.data.label?.href && flowData.data.label.href}
                    data-type='href'
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export function ResultNode({ flowData, addNode, addEdge }: { flowData: any; addNode: Function; addEdge: Function }) {
  // console.log('data ===> ', data.data.label);
  return (
    <>
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='target' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='target' />
      <div className='min-w-[500px] bg-light-200 max-w-2xl flex'>
        <div className='bg-info-300 px-0 py-2 flex-shrink-0 flex flex-col items-center justify-center w-10 text-white text-sm font-medium rounded-l-sm'>
          <GoogleIcon className='w-5 h-5' />
          <div className='flex-1 justify-center -mt-5 flex flex-col'>
            <GripIcon className='h-5 w-5' />
          </div>
        </div>
        <ul
          role='list'
          className='w-full grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 py-1 rounded-b-sm shadow-sm'
        >
          <li className='col-span-full flex  w-full'>
            <div className='flex-1 flex flex-col whitespace-wrap px-4 pb-2 text-sm'>
              <p data-type='title' className='text-lg '>
                {flowData.data.label.title && flowData.data.label.title}
              </p>
              <p data-type='description' className='text-sm  whitespace-wrap max-w-xl'>
                {flowData.data.label.description && flowData.data.label.description}
              </p>
              <div
                onClick={() => {
                  navigator.clipboard.writeText(flowData.data.label.link);
                  toast.success('The URL has been copied to your clipboard');
                }}
                className='flex items-center'
              >
                <PaperClipIcon className='w-5 h-5 text-info-200 mx-1' />
                <p data-type='link' className='text-sm text-info-200 max-w-xl whitespace-wrap'>
                  {flowData.data.label.link && flowData.data.label.link}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </>
  );
}

export function EmailNode({ flowData }: any) {
  const [emailValue, setEmailValue] = useState<string>(flowData.data.email);

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className=' flex flex-col w-72 max-w-2xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-alert-600 text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-dark-300  whitespace-wrap font-display'>Email</p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display'>
              <span className='text-xs text-dark-300 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
          </div>
          <WebsiteIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>URL</p>
              <div className='flex items-center mb-1'>
                <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                  <MagnifyingGlassIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                  <input
                    type='text'
                    data-type='domain'
                    value={emailValue}
                    className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    placeholder='www.google.com'
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export function IpNode({ flowData, deleteNode }: any) {
  const [ips, setIps] = useState(flowData.data.label);
  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log('ips', ips);
  };

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className=' flex flex-col w-72 max-w-2xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-warning text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>IP Address</p>
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
                <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                  IP Address
                </p>
                <div className='flex items-center mb-1'>
                  <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                    <IpIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                    <input
                      type='text'
                      data-type='domain'
                      onChange={(event: any) => setIps(event.target.value)}
                      value={ips}
                      className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                    />
                  </div>
                </div>
              </>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export function WhoisNode({ flowData }: any) {
  console.log(flowData);
  const [seoData, setSeoData] = useState(flowData.data.label);
  const handleSubmit = (event: any) => {
    event.preventDefault();
  };
  console.log(flowData.data.label);
  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />

      <div className=' flex flex-col  h-64 w-[32rem] max-w-9xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-start justify-between rounded-t-sm bg-pink-600 text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>WHOIS</p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display'>
              <span className='text-xs text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
          </div>
          <WebsiteIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex  w-full p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <div className='flex overflow-y-scroll h-52 flex-col mb-1 w-full'>
              {flowData.data && flowData.data.label && flowData.data.label.split('\n').map((whois: string) => {
                const data = whois.split(':');
                return (
                  <div className='flex items-center w-full'>
                    <p
                      className='truncate text-xs font-display flex items-center whitespace-wrap pl-4'
                      placeholder='https://www.google.com'
                    >
                      {whois}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function DnsNode({ flowData }: any) {
  const [dnsData, setDnsData] = useState(flowData.data.label);
  const handleSubmit = (event: any) => {
    event.preventDefault();
    console.log('ips', dnsData);
  };

  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className=' flex flex-col w-[30rem] max-w-2xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-primary-800 text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>DNS</p>
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
                {dnsData.map((dns: any) => {
                  console.log(dns.value);
                  return (
                    <>
                      <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                        {dns.type}
                      </p>
                      {dns.value.map((dnsRecord: any) => {
                        return (
                          <div className='flex items-center mb-1'>
                            <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                              <IpIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />

                              <input
                                type='text'
                                data-type='domain'
                                onChange={(event: any) => setDnsData(event.target.value)}
                                value={dnsRecord}
                                className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-[28rem] bg-light-200 focus:bg-light-50'
                              />
                            </div>
                          </div>
                        );
                      })}
                    </>
                  );
                })}
              </>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export function SubdomainNode({ flowData }: any) {
  const [task, setTask] = useState<string>(flowData.data.id);
  const [subdomains, setSubdomains] = useState<Array<string>>([]);
  const [status, setStatus] = useState<string>(flowData.data.status);

  const [ticking, setTicking] = useState(true);

  useEffect(() => {
    const scheduler = new IntervalBasedCronScheduler(60 * 1000);
    api.get(`/extract/domain/subdomains/status?id=${task}`).then((resp) => {
      console.log('CALLED inside', resp);
      if (resp.data.status !== 'PENDING') {
        setStatus('DONE');
      }
      setSubdomains(resp.data.task.subdomains);
    });
    if (status === 'PENDING') {
      scheduler.registerTask(parseCronExpression('*/16 * * * *'), async () => {
        console.log('CALLED');
        await api.get(`/extract/domain/subdomains/status?id=${task}`).then((resp) => {
          console.log('CALLED inside', resp);
          if (resp.data.status !== 'PENDING') {
            setStatus('DONE');
            scheduler.stop();
          }
          setSubdomains(resp.data.task.subdomains);
        });
      });
    }
  }, []);

  console.log('flowData', flowData.data);
  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' />
      <Handle position={Position.Top} id='t1' key='t1' type='source' />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' />
      <Handle position={Position.Left} id='l1' key='l1' type='target' />
      <div className=' flex flex-col w-72 max-w-2xl justify-between rounded-sm transition duration-150 ease-in-out hover:bg-light-200 bg-light-100'>
        <div className='flex h-full w-full items-center justify-between rounded-t-sm bg-persian-300 text-white py-2 px-1'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 font-semibold'>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>Subdomains</p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display'>
              <span className='text-xs text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
          </div>
          <WebsiteIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form className='flex items-start flex-col'>
              {status !== 'PENDING' ? (
                <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                  Subdomains
                </p>
              ) : (
                <div className='flex items-center justify-center w-full'>
                  <p className='text-[0.5rem] ml-2 font-semibold text-gray-400  whitespace-wrap font-display'>
                    Loading
                  </p>
                  <RoundLoader className='ml-2' />
                </div>
              )}
              {subdomains &&
                subdomains.map((subdomain) => (
                  <div className='flex items-center mb-1'>
                    <div className='mt-1  w-full px-2 flex bg-light-200 py-0.5 border-dark relative border-opacity-60  text-gray-500 border rounded-2xl focus:border-opacity-100  text-xs'>
                      <WebsiteIcon className='h-3.5 w-3.5 pl-0.5 absolute top-1 text-gray-50 z-50' />
                      <input
                        type='text'
                        data-type='domain'
                        value={subdomain}
                        className='placeholder:text-gray-50 rounded-2xl  focus:outline-none pl-4 w-64 bg-light-200 focus:bg-light-50'
                      />
                    </div>
                  </div>
                ))}
              <input
                type='text'
                className='hidden'
                onChange={() => null}
                value={flowData.data && flowData.data.id}
                data-type='origin'
              />
              <input
                type='text'
                onChange={() => null}
                className='hidden'
                value={flowData.data && flowData.data.status}
                data-type='href'
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
