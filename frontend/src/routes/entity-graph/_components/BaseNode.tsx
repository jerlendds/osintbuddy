// @ts-nocheck
import { ChevronUpDownIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { Combobox } from '@headlessui/react';
import classNames from 'classnames';
import { ChangeEvent, Dispatch, Fragment, useEffect, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { GripIcon, Icon } from '@/components/Icons';
import { toast } from 'react-toastify';
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

export default function BaseNode({ ctx, sendJsonMessage }: { ctx: JSONObject; sendJsonMessage: () => void }) {
  const node = ctx.data;

  const dispatch = useAppDispatch();

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
          <UploadFileInput
            key={key}
            nodeId={ctx.id}
            label={element?.label}
            initialValue={element?.value || ''}
            icon={element?.icon || 'file-upload'}
            sendJsonMessage={sendJsonMessage}
            dispatch={dispatch}
          />
        );
      case 'title':
        return (
          <Title
            key={key}
            nodeId={ctx.id}
            label={element?.label}
            title={element?.title || ''}
            subtitle={element?.subtitle || ''}
            text={element?.text || ''}
            dispatch={dispatch}
          />
        );

      case 'section':
        return (
          <Text key={key} nodeId={ctx.id} label={element?.label} value={element?.value || ''} dispatch={dispatch} />
        );
      case 'copy-text':
        return (
          <CopyText key={key} nodeId={ctx.id} label={element?.label} value={element?.value || ''} dispatch={dispatch} />
        );
      case 'empty':
        return <div className='hidden' />;
    }
  };

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
      <div data-label-type={node.label} className=' node container' style={node.style}>
        <div style={{ backgroundColor }} className='header '>
          <GripIcon className='' />
          <div className='text-container '>
            <p className='text-[0.4rem] text-light-900  whitespace-wrap font-display'>
              <span className='text-[0.5rem] text-light-900 max-w-xl whitespace-wrap font-display'>ID: </span>
              {ctx.id}
            </p>
            <p className='text-xs text-light-200 max-w-xl whitespace-wrap font-display font-bold'>{node.label}</p>
          </div>
          <Icon icon={node.icon} className='h-5 w-5 mr-2 cursor-grab focus:cursor-grabbing' />
        </div>
        <form
          id={`${ctx.id}-form`}
          style={node.style}
          onSubmit={(event) => event.preventDefault()}
          className='nodrag elements gap-x-1'
        >
          {node.elements.map((element: NodeInput, i: number) => {
            if (Array.isArray(element))
              return (
                <Fragment key={i.toString()}>
                  {element.map((elm, i: number) => (
                    <div key={i.toString()} className='flex flex-col mr-2 last:mr-0'>
                      {getNodeElement(elm, `${elm.label}-${elm.id}-${ctx.id}`)}
                    </div>
                  ))}
                </Fragment>
              );
            return getNodeElement(element, `${element.label}-${element.id}-${ctx.id}`);
          })}
        </form>
      </div>
    </>
  );
}

export function CopyText({ nodeId, label, value }: { nodeId: string; label: string; value: string }) {
  return (
    <div
      onClick={() => {
        navigator.clipboard.writeText(value);
        toast.success(`Copied ${label} to clipboard!`);
      }}
      className='flex items-center max-w-xs text-info-300'
    >
      <PaperClipIcon className='w-4 h-4 text-inherit text-info-200 shrink-0' />
      <p
        title='Click to copy'
        data-type='link'
        className='ml-2 text-xs text-inherit break-keep whitespace-nowrap  truncate'
      >
        {value}
      </p>
      <input type='text' className='hidden' data-label={label} id={`${nodeId}-${label}`} value={value} readOnly />
    </div>
  );
}

export function Text({ nodeId, label, value, icon }: { nodeId: string; label: string; value: string; icon?: any }) {
  return (
    <div className='w-full flex flex-col px-2 pb-1'>
      <p className='text-xs text-slate-300 whitespace-wrap font-medium'>{label}</p>
      <div className=' w-full flex relative text-slate-500 text-xs sm:text-sm'>
        {icon && <Icon icon={icon} className='h-6 w-6' />}
        <p className='text-xs text-slate-400 truncate'>{value}</p>
        <input data-label={label} id={`${nodeId}-${label}`} className='hidden' readOnly value={value} />
      </div>
    </div>
  );
}

export function Title({
  nodeId,
  label,
  title,
  subtitle,
  text,
}: {
  nodeId: string;
  label: string;
  title: string;
  subtitle: string;
  text: string;
}) {
  return (
    <div className='node-display'>
      {title && <h1 data-type='title'>{title}</h1>}
      {subtitle && <h2 data-type='subtitle'>{subtitle}</h2>}
      {text && <p data-type='text'>{text}</p>}
      <input className='hidden' readOnly data-label={label} id={`${nodeId}-${label}`} value={title} />
      <input className='hidden' readOnly data-label={label} id={`${nodeId}-${label}`} value={subtitle} />
      <input className='hidden' readOnly data-label={label} id={`${nodeId}-${label}`} value={text} />
    </div>
  );
}

export function UploadFileInput({
  nodeId,
  initialValue,
  label,
  sendJsonMessage,
  icon,
}: {
  nodeId: string;
  label: string;
  initialValue: string;
  sendJsonMessage: Function;
  icon?: any;
}) {
  const [value, setValue] = useState<File>(initialValue as any);

  const updateValue = (event: ChangeEvent<HTMLInputElement>) => {
    if (event?.target?.files && event?.target?.files?.length > 0) {
      const file = event.target.files[0];
      setValue(file);
      sendJsonMessage({ action: 'update:node', node: { id: nodeId, [label]: file, name: file?.name || 'unknown' } });
    }
  };

  return (
    <>
      <p className='text-[0.5rem] ml-1 text-slate-400 whitespace-wrap font-semibold font-display mt-1'>{label}</p>
      <div className='flex items-center mb-1'>
        <div className='node-field'>
          <Icon icon={icon} className='h-6 w-6' />
          <label className={classNames('ml-5 w-52', value?.name && 'text-slate-400')}>
            <input
              data-label={label}
              id={`${nodeId}-${label}`}
              type='file'
              className='nodrag'
              onChange={(event: any) => updateValue(event)}
            />
            {value?.name ? value.name : label}
          </label>
        </div>
      </div>
    </>
  );
}

export function TextInput({ nodeId, label, sendJsonMessage, icon, dispatch }: NodeElement) {
  // @todo remove this hack once firefox supports `:has`
  const [isFocused, setFocused] = useState(false);

  const value = useAppSelector((state) => selectNodeValue(state, nodeId, label));
  return (
    <>
      <div className='flex flex-col'>
        <p className='text-[0.5rem] ml-1 text-slate-400 whitespace-wrap font-semibold font-display mt-1'>{label}</p>
        <div className='flex items-center mb-1 '>
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
        </div>
      </div>
    </>
  );
}

interface DropdownOption {
  label: string;
  tooltip: string;
  value: string;
}

export function DropdownInput({ options, label, nodeId, sendJsonMessage, dispatch }: NodeElement) {
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
    tooltip: ''
  };

  return (
    <>
      <Combobox
        className=' w-full z-[999] dropdown-input'
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
