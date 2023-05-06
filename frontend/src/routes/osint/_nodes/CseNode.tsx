import { useState, useEffect, useRef, useCallback, ChangeEvent } from 'react';
import { GripIcon, IpIcon } from '@/components/Icons';
import api from '@/services/api.service';
import { ChevronUpDownIcon, ListBulletIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Combobox } from '@headlessui/react';
import classNames from 'classnames';
import { NodeContextProps } from '.';
import { toast } from 'react-toastify';
import { Handle, Position } from 'reactflow';
import { handleStyle } from './styles';

export function CseNode({ flowData, sendJsonMessage }: any) {
  const isMounted = useRef(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [query, setQuery] = useState('');
  const [pages, setPages] = useState(1);
  const [activeOption, setActiveOption] = useState<any>(null);
  const [activeCseData, setActiveCseData] = useState([]);
  const [cseData, setCseData] = useState([]);

  const getCseLinks = useCallback(() => {
    api
      .get('/ghdb/cses')
      .then((resp) => {
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
    } else {
      isMounted.current = true;
      getCseLinks();
    }
  }, [isMounted]);
  const updateInputField = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    sendJsonMessage({action: 'update:node', node: { id: flowData.id, type: flowData.type, searchQuery: event.target.value }})
  };
  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' style={handleStyle} />
      <Handle position={Position.Top} id='t1' key='t1' type='source' style={handleStyle} />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' style={handleStyle} />
      <Handle position={Position.Left} id='l1' key='l1' type='target' style={handleStyle} />
      <div className='node container min-w-[30rem]'>
        <div className='header bg-aquamarine-800 bg-opacity-40'>
          <GripIcon className='h-5 w-5' />
          <div className='flex w-full flex-col px-2 '>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>
              {' '}
              <span className='text-[0.5rem] text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {flowData.id}
            </p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display font-bold'>
              Google CSE (custom search engine)
            </p>
          </div>
          <IpIcon className='h-5 w-5 mr-2' />
        </div>
        <div className='flex md:h-full w-full  p-2'>
          <div className='md:flex-col md:flex w-full md:flex-1  md:justify-between '>
            <form onSubmit={(e) => e.preventDefault()} className='flex items-start flex-col'>
              <>
                <>
                  <div className='flex'>
                    <div className='flex flex-col'>
                      <p className='text-[0.5rem] ml-2  text-slate-400  whitespace-wrap font-display'>Query</p>
                      <div className='flex items-center mb-1 mr-4'>
                        <div className='node-field'>
                          <MagnifyingGlassIcon />
                          <input type='text' data-node='query' onChange={(event: any) => updateInputField(event)} />
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col'>
                      <p className='text-[0.5rem] ml-2  text-slate-400  whitespace-wrap font-display'>Pages</p>
                      <div className='flex items-center mb-1'>
                        <div className='node-field'>
                          <MagnifyingGlassIcon />
                          <input
                            type='number'
                            data-node='pages'
                            defaultValue={1}
                            onChange={(event: any) => setPages(event.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Combobox className='w-full z-50' as='div' value={activeOption} onChange={setActiveOption}>
                    <Combobox.Label>
                      <p className='text-[0.5rem] ml-2  text-slate-400  whitespace-wrap font-display mt-4'>
                        CSE Categories
                      </p>
                    </Combobox.Label>
                    <div className='relative mt-1'>
                      <Combobox.Input
                        className='node-field pl-2 text-slate-200'
                        onChange={(event) => setQuery(event.target.value)}
                        displayValue={(cse: any) => cse?.title}
                      />
                      <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
                        <ChevronUpDownIcon className='h-5 w-5 text-slate-400' aria-hidden='true' />
                      </Combobox.Button>

                      {filteredCseOptions.length > 0 && (
                        <Combobox.Options className='absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-b-md bg-dark-400 py-1 text-base shadow-lg ring-1 ring-gray-200 ring-opacity-5 focus:outline-none sm:text-sm'>
                          {filteredCseOptions.map((cse: any) => (
                            <>
                              <Combobox.Option
                                // @ts-ignore
                                key={cse.url}
                                value={cse}
                                className={({ active }) =>
                                  classNames(
                                    'relative cursor-default select-none py-2 pl-3 pr-9 ',
                                    active ? 'bg-slate-900 text-slate-300' : 'text-slate-400'
                                  )
                                }
                              >
                                {({ active, selected }) => (
                                  <>
                                    {cse.description !== cse.title && (
                                      <span
                                        title={cse.description || 'No description found'}
                                        className={classNames('block  truncate  pl-3')}
                                      >
                                        {cse.title}
                                      </span>
                                    )}
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
              <input
                type='text'
                data-node='cse'
                onChange={() => null}
                value={activeOption?.url}
                className='hidden invisible'
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export function CseNodeContext({
  node,
  reactFlowInstance,
  addNode,
  addEdge,
  nodeData,
  nodeType,
  parentId,
  getId,
}: NodeContextProps) {
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <div className='node-context'>
      <div>
        <button
          onClick={() => {
            const bounds = node.getBoundingClientRect();
            // toast.info('Fetching results');
            const query = nodeData[0].value;
            const pages = nodeData[1].value;
            const url = JSON.parse(nodeData[2].value).url;
            console.log(`/cses/crawl?query=${query}&pages=${pages}&url=${encodeURIComponent(url)}`);
            const toastId = toast.loading('Fetching results...');
            api
              .get(`/cses/crawl?query=${query}&pages=${pages}&url=${encodeURIComponent(url)}`)
              .then((resp) => {
                const data = resp?.data?.results || [];
                if (data.length === 0) return Promise.reject();
                toast.update(toastId, {
                  render: `Found ${data.length} results`,
                  type: 'success',
                  isLoading: false,
                  autoClose: 4000,
                });
                data.forEach((result: any, rIdx: number) => {
                  const nodeId = getId();
                  result.description = result.content;
                  addNode(
                    nodeId,
                    'result',
                    {
                      x: rIdx % 2 === 0 ? bounds.x + 60 : bounds.x + 600,
                      y: rIdx % 2 === 0 ? rIdx * 60 + bounds.y : (rIdx - 1) * 60 + bounds.y,
                    },
                    {
                      ...result,
                    }
                  );
                  addEdge(parentId, nodeId);
                });
              })
              .catch((error) => {
                console.warn(error);
                toast.update(toastId, { render: `No results found`, type: 'error', isLoading: false, autoClose: 4000 });
              });
          }}
        >
          <ListBulletIcon aria-hidden='true' />
          To results
        </button>
      </div>
    </div>
  );
}
