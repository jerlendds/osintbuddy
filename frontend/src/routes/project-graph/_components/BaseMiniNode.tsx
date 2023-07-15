// @ts-nocheck
import { ChevronUpDownIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { Combobox } from '@headlessui/react';
import classNames from 'classnames';
import { ChangeEvent, Dispatch, Fragment, useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { GripIcon, Icon } from '@/components/Icons';
import { Dialog } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { type ThunkDispatch } from 'redux-thunk';
import { setEditState, type Graph, EditState, saveUserEdits, selectNodeValue } from '@/features/graph/graphSlice';

var dropdownKey = 0;

const getKey = () => {
  dropdownKey += 1;
  return `k_${dropdownKey}`;
};

var nodeKey = 0;

const getNodeKey = () => {
  nodeKey += 1;
  return `k_${nodeKey}`;
};

const handleStyle = { borderColor: '#60666A' };

type NodeElement = NodeInput & {
  nodeId: string;
  editState: EditState;
  dispatch: ThunkDispatch<{ settings: { showSidebar: boolean }; graph: Graph }, undefined, AnyAction> &
    Dispatch<AnyAction>;
};

export function useComponentVisible(initialIsVisible) {
    const [isOpen, setIsOpen] = useState(initialIsVisible);
    const ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);


    return { ref, isOpen, setIsOpen };
}

export default function BaseMiniNode({ ctx, sendJsonMessage }: { ctx: JSONObject; sendJsonMessage: () => void }) {
  const node = ctx.data;

  const dispatch = useAppDispatch();

  const backgroundColor = node?.color?.length === 7 ? `${node.color}76` : node?.color ? node.color : '#145070';

  const getNodeElement = (element: NodeInput, key: string | null = getNodeKey()) => {
    switch (element.type) {
      case 'dropdown':
        return (
          <DropdownInput
            key={key}
            nodeId={ctx.id}
            value={ctx?.value}
            options={element.options || []}
            label={element.label}
            value={element.value as string}
            sendJsonMessage={sendJsonMessage}
            dispatch={dispatch}
          />
        );
      case 'text':
        return (
          <TextInput
            key={key}
            nodeId={ctx.id}
            label={element?.label}
            icon={element?.icon || 'ballpen'}
            sendJsonMessage={sendJsonMessage}
            dispatch={dispatch}
          />
        );
      case 'upload':
        return (
          <h2 className='text-slate-400 text-xs max-w-sm font-sans'>
            Editing upload entity elements is not currently supported. 
          </h2>
        );
      case 'title':
        return (
          <h2 className='text-slate-400 text-xs max-w-sm font-sans'>
            Editing title entity elements is not currently supported.
          </h2>
        );
      case 'section':
        return (
          <h2 className='text-slate-400 text-xs max-w-sm font-sans'>
            Editing section entity elements is not currently supported.
          </h2>
        );
      case 'copy-text':
        return (
          <h2 className='text-slate-400 text-xs max-w-sm font-sans'>
            Editing copy entity elements is not currently supported.
          </h2>
        );
      case 'empty':
        return <div className='hidden' />;
    }
  };

  const {ref, isOpen, setIsOpen } = useComponentVisible(false)
  return (
    <>
      <Handle position={Position.Right} id='r1' key='r1' type='source' style={handleStyle} />
      <Handle position={Position.Top} id='t1' key='t1' type='source' style={handleStyle} />
      <Handle position={Position.Bottom} id='b1' key='b1' type='source' style={handleStyle} />
      <Handle position={Position.Left} id='l1' key='l1' type='source' style={handleStyle} />

      <Handle position={Position.Right} id='r2' key='r2' type='target' style={handleStyle} />
      <Handle position={Position.Top} id='t2' key='t2' type='target' style={handleStyle} />
      <Handle position={Position.Bottom} id='b2' key='b2' type='target' style={handleStyle} />
      <Handle position={Position.Left} id='l2' key='l2' type='target' style={handleStyle} />
      <div
        onClick={() => setIsOpen(true)}
        data-label-type={node.label}
        className='node container !rounded-full'
        style={node.style}
      >
        <div style={{ backgroundColor }} className='header !rounded-full !p-4'>
          <Icon icon={node.icon} className='h-5 w-5 cursor-grab focus:cursor-grabbing' />
        </div>
      </div>
    
        <>
        <div   ref={ref}  className="flex flex-col">
            <div className={classNames(isOpen ? 'fixed left-14 top-10 w-full min-w-[18rem] min-h-[4.5rem] pl-2 bg-dark-700 border-dark-300 border pt-2 pb-4 rounded-md' : 'hidden ')}>
            <h2 className='text-slate-400 font-display text-xs font-medium leading-5 flex'>
              Editing {node.label} <span className='font-display text-xs font-light ml-auto mr-2'>{ctx.id}</span>
            </h2>
            {node.elements.map((element) => {
              if (Array.isArray(element)) {
                return element.map((elm, i) => (
                  <div key={i.toString()} className='flex flex-col mr-2 last:mr-0'>
                    {' '}
                    {getNodeElement(elm, `${elm.label}-${elm.id}-${ctx.id}`)}
                  </div>
                ));
              }
              return <div className='mr-2'>{getNodeElement(element, `${element.label}-${element.id}-${ctx.id}`)}</div>;
            })}
          </div>
        </div>
        
        </>
    </>
  );
}

function TextInput({ nodeId, label, sendJsonMessage, icon, dispatch }: NodeElement) {
  // @todo remove this hack once firefox supports `:has`
  const [isFocused, setFocused] = useState(false);
  const value = useAppSelector((state) => selectNodeValue(state, nodeId, label));

  return (
    <>
      <p className='text-[0.5rem] ml-1 text-slate-400 whitespace-wrap font-semibold font-display mt-1'>{label}</p>
      <div className={classNames('nodrag node-field', isFocused && 'ring-info-400')}>
        <Icon icon={icon} className='h-6 w-6' />
        <input
          id={`${nodeId}-${label}`}
          type='text'
          data-label={label}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            sendJsonMessage({ action: 'update:node', node: { id: nodeId, [label]: value } });
            setFocused(false);
          }}
          onChange={(event: InputEvent) => dispatch(saveUserEdits({ value: event.target.value, nodeId, label }))}
          value={value}
        />
      </div>
    </>
  );
}

function DropdownInput({ options, label, nodeId, sendJsonMessage, dispatch }: NodeElement) {
  const [query, setQuery] = useState('');
  const filteredOptions =
    query === ''
      ? options ?? []
      : options?.filter((option: DropdownOption) => {
          return option.label.toLowerCase().includes(query.toLowerCase());
        }) ?? [];

  const activeValue = useAppSelector((state) => selectNodeValue(state, nodeId, label));

  const activeOption = options.find((option) => option.value === activeValue || option.label === activeValue) ?? {
    label: '',
    value: '',
    tooltip: '',
  };

  return (
    <>
      <Combobox
        className=' w-full z-[999] dropdown-input !pr-2'
        as='div'
        value={activeOption}
        onChange={(option) => {
          sendJsonMessage({
            action: 'update:node',
            node: {
              id: nodeId,
              [label]: option?.value ? option.value : option.label,
            },
          });
          dispatch(
            saveUserEdits({
              value: option?.value ? option.value : option.label,
              nodeId,
              label,
            })
          );
        }}
      >
        <Combobox.Label>
          <p className='text-[0.5rem] ml-1 text-slate-400 whitespace-wrap font-semibold font-display mt-1'>{label}</p>
        </Combobox.Label>
        <div className='relative mt-1 '>
          <Combobox.Input
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(option: DropdownOption) => option.label}
            className='nodrag focus:ring-info-400 node-field outline-none pl-2'
          />
          <Combobox.Button className='absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none'>
            <ChevronUpDownIcon className='h-5 w-5 text-slate-600' aria-hidden='true' />
          </Combobox.Button>

          {filteredOptions.length > 0 && (
            <Combobox.Options className='absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-b-md bg-dark-400 py-1 text-base shadow-lg ring-1 ring-gray-200 ring-opacity-5 focus:outline-none sm:text-sm'>
              {filteredOptions.map((option: DropdownOption) => (
                <Combobox.Option
                  key={getKey()}
                  value={option}
                  className={({ active }) =>
                    classNames(
                      'relative nodrag nowheel cursor-default select-none py-2 pl-3 pr-9',
                      active ? 'bg-slate-900 text-slate-300' : 'text-slate-400'
                    )
                  }
                >
                  <span
                    className={classNames('block truncate pl-2')}
                    title={option?.tooltip !== option.label ? option.tooltip : 'No description found'}
                  >
                    {option.label}
                  </span>
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </>
  );
}
