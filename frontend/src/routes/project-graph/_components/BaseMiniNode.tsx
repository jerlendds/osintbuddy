// @ts-nocheck
import { ChevronUpDownIcon, PaperClipIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Combobox } from '@headlessui/react';
import classNames from 'classnames';
import { ChangeEvent, Dispatch, Fragment, useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { GripIcon, Icon } from '@/components/Icons';
import { Dialog } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { type ThunkDispatch } from 'redux-thunk';
import {
  setEditState,
  type Graph,
  EditState,
  saveUserEdits,
  selectNodeValue,
  setEditId,
} from '@/features/graph/graphSlice';

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

const getNodeElement = (nodeId, value, element: NodeInput, key: string | null = getNodeKey(), sendJsonMessage) => {
  const dispatch = useAppDispatch();

  switch (element.type) {
    case 'dropdown':
      return (
        <DropdownInput
          key={key}
          nodeId={nodeId}
          value={value}
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
          nodeId={nodeId}
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

export default function BaseMiniNode({
  ctx,
  sendJsonMessage,
  setIsEditing,
}: {
  ctx: JSONObject;
  sendJsonMessage: () => void;
  setIsEditing: () => void;
}) {
  const node = ctx.data;

  const dispatch = useAppDispatch();

  const backgroundColor = node?.color?.length === 7 ? `${node.color}76` : node?.color ? node.color : '#145070';

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
        onClick={() => {
          dispatch(setEditId(ctx.id));
          setIsEditing(true);
        }}
        data-label-type={node.label}
        className='node container !rounded-full'
        style={node.style}
      >
        <div style={{ backgroundColor }} className='header !rounded-full !p-4'>
          <Icon icon={node.icon} className='!h-14 !w-14  cursor-grab focus:cursor-grabbing' />
        </div>
      </div>
    </>
  );
}

export function MiniEditDialog({ ref, isOpen, setIsOpen, activeNode, nodeId, sendJsonMessage }) {
  console.log('activeNode', activeNode);
  return (
    <>
      {activeNode && (
        <div ref={ref} className='flex flex-col'>
          <div
            className={classNames(
              'z-50',
              isOpen
                ? 'absolute top-0 right-0 max-w-sm w-full min-h-[4.5rem] pl-2 bg-dark-700 border-dark-300 border pt-2 pb-4 rounded-md rounded-t-none'
                : 'hidden '
            )}
          >
            <button
              onClick={() => setIsOpen(false)}
              className='absolute right-0 top-0 -left-7 z-0 bg-dark-700 rounded-b-md border-dark-300 border-b border-l border-t hover:text-slate-200 text-slate-400'
            >
              <XMarkIcon className='w-7 h-7 text-inherit' />
            </button>
            <h2 className='text-slate-400 font-display text-lg font-medium leading-5 flex'>
              {activeNode.data.label} <span className='font-display text-xs font-light ml-auto mr-2'>{nodeId}</span>
            </h2>
            {activeNode.data.elements.map((element) => {
              if (Array.isArray(element)) {
                return element.map((elm, i) => (
                  <div key={i.toString()} className='flex flex-col mr-2 last:mr-0'>
                    {' '}
                    {getNodeElement(nodeId, elm.value, elm, `${elm.label}-${elm.id}-${nodeId}`, sendJsonMessage)}
                  </div>
                ));
              }
              return (
                <div className='mr-2'>
                  {getNodeElement(
                    nodeId,
                    element.value,
                    element,
                    `${element.label}-${element.id}-${nodeId}`,
                    sendJsonMessage
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
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
