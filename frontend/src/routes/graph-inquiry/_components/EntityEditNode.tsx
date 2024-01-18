// @ts-nocheck
import { ChevronUpDownIcon, PaperClipIcon } from '@heroicons/react/24/outline';
import { Combobox } from '@headlessui/react';
import classNames from 'classnames';
import { ChangeEvent, Dispatch, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Handle, Position } from 'reactflow';
import { GripIcon, Icon } from '@src/components/Icons';
import { toast } from 'react-toastify';
import List from 'react-virtualized/dist/es/List'
import { useAppDispatch, useAppSelector } from '@src/app/hooks';
import { type ThunkDispatch } from 'redux-thunk';
import { type Graph, EditState, saveUserEdits, selectNodeValue, disableEntityEdit, setEditState } from '@src/features/graph/graphSlice';
import { AnyAction, current } from '@reduxjs/toolkit';

var dropdownKey = 0;

const getDropdownKey = () => {
  dropdownKey += 1;
  return `k_${dropdownKey}`;
};

var nodeKey = 0;

const getNodeKey = () => {
  nodeKey += 1;
  return `k_${nodeKey}`;
};

const handleStyle = { borderColor: '#39477899', background: '#12172720', width: 12, margin: -1, height: 12 }

type NodeElement = NodeInput & {
  nodeId: string;
  editState: EditState;
  dispatch: ThunkDispatch<{ settings: { showSidebar: boolean }; graph: Graph }, undefined, AnyAction> &
  Dispatch<AnyAction>;
};

export default function EditEntityNode({ ctx, sendJsonMessage, closeRef }: JSONObject) {
  const node = ctx.data;

  const dispatch = useAppDispatch();

  const getNodeElement = (element: NodeInput, key: string | null = getNodeKey(), width: number = 1) => {
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
            value={element?.value || ''}
            dispatch={dispatch}
          />
        );

      case 'section':
        return (
          <Text
            key={key}
            nodeId={ctx.id}
            label={element?.label}
            value={element?.value || ''}
            dispatch={dispatch}
          />
        );
      case 'textarea':
        return (
          <TextArea
            key={key}
            nodeId={ctx.id}
            label={element?.label}
            value={element?.value || ''}

            dispatch={dispatch}
            sendJsonMessage={sendJsonMessage}
            dispatch={dispatch}
          />
        );
      case 'copy-text':
        return (
          <CopyText
            key={key}
            nodeId={ctx.id}
            label={element?.label}
            value={element?.value || ''}
            dispatch={dispatch}
          />
        );
      case 'empty':
        return <input className='h-0 bg-transparent pointer-events-none' />;
    }
  };

  const columnsCount = Math.max(0, ...node.elements.map(s => s.length === undefined ? 1 : s.length))
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
      <div className='node container'>
        <div
          // 99 === 0.6 opacity
          style={{ backgroundColor: node?.color?.length === 7 ? `${node.color}99` : node?.color }}
          className='header '
        >
          <GripIcon />
          <div className='text-container '>
            <p className='text-[0.4rem] flex font-black  text-mirage-900  whitespace-wrap font-display'>
              <span className='mr-1 text-[0.5rem] text-mirage-900 font-extralight max-w-xl whitespace-wrap '> ID: </span>
              {ctx.id}
            </p>
            <p className='text-xs text-slate-200 max-w-xl whitespace-wrap font-display font-bold'>{node.label}</p>
          </div>
          <Icon icon={node.icon} className='h-5 w-5 mr-2 cursor-grab focus:cursor-grabbing' />
        </div>
        <form
          id={`${ctx.id}-form`}
          style={node.style}
          onSubmit={(event) => event.preventDefault()}
          className='elements'
          style={{
            gridTemplateColumns: '100%'
          }}
        >
          {node.elements.map((element: NodeInput, i: number) => {
            if (Array.isArray(element)) {
              return (
                <div style={{ display: 'grid', columnGap: '0.5rem', gridTemplateColumns: `repeat(${element.length}, minmax(0, 1fr))` }} key={i.toString()}>
                  {element.map((elm, i: number) => (
                    <Fragment key={i.toString()}>
                      {getNodeElement(elm, `${elm.label}-${elm.id}-${ctx.id}`, 1)}
                    </Fragment>
                  ))}
                </div>
              );
            }
            return getNodeElement(element, `${element.label}-${element.id}-${ctx.id}`, 2);
          })}
        </form>
      </div >
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


export function TextArea({ nodeId, label, sendJsonMessage, icon, dispatch }: NodeElement) {
  const initValue = useAppSelector((state) => selectNodeValue(state, nodeId, label));

  const [value, setValue] = useState(initValue)
  const [showMonospace, setShowMonospace] = useState(true)

  return (
    <div className='flex flex-col w-full'>
      <label
        onClick={() => setShowMonospace(!showMonospace)}
        className='flex justify-between items-center font-semibold leading-5 font-display text-slate-400'
      >
        {label}
        <Icon
          icon={showMonospace ? 'brackets-angle' : 'brackets-angle-off'}
          className='h-4 w-4 text-slate-500'
        />
      </label>
      <div className='node-field !w-full !min-w-2xl'>
        <textarea
          rows={16}
          className={`form-input min-w-[16rem] text-xs text-slate-400 nodrag nowheel whitespace-wrap px-1 py-1.5 ${showMonospace && '!font-code'}`}
          value={value}
          onChange={(event) => setValue(event.currentTarget.value)}
          onBlur={() => {
            sendJsonMessage({ action: 'update:node', node: { id: nodeId, [label]: value } });
            dispatch(saveUserEdits({ value, nodeId, label }))
          }}
        />
      </div>
    </div>
  );
}

const MAX_TEXT_LENGTH = 100;

export function Text({ nodeId, label, value, icon }: { nodeId: string; label: string; value: string; icon?: any }) {
  return (
    <div className=' w-full flex  pb-1 relative text-slate-400'>
      {icon && <Icon icon={icon} className='h-6 w-6' />}
      <p className='text-xs text-slate-400 transition-colors duration-500 ease-out pr-2.5'>{value} </p>
    </div >
  );
}

export function Title({
  nodeId,
  label,
  value,
}: {
  nodeId: string;
  label: string;
  value: string;
}) {
  return (
    <div className='node-display !py-0 !my-0'>
      {value && <h1 className='my-0'>{value}</h1>}
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
  const initValue = useAppSelector((state) => selectNodeValue(state, nodeId, label));

  const [value, setValue] = useState(initValue)

  return (
    <>
      <div className='flex flex-col'>
        <label className='text-[0.5rem] mt-1 text-slate-400 whitespace-wrap font-semibold font-display '>
          {label}
        </label>
        <div className='nodrag node-field'>
          <Icon icon={icon} className='h-5 w-5' />
          <input
            id={`${nodeId}-${label}`}
            type='text'
            onBlur={() => {
              sendJsonMessage({ action: 'update:node', node: { id: nodeId, [label]: value } });
              dispatch(saveUserEdits({ value, nodeId, label }))
            }}
            onChange={(event: InputEvent) => setValue(event.currentTarget.value)}
            value={value ?? initValue}
          />
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
  const dropdownRef = useRef(200)
  const filteredOptions = useMemo(() =>
    query === ''
      ? [...options].sort((a, b) => a.label.localeCompare(b.label)) ?? []
      : [...options]?.sort((a, b) => a.label.localeCompare(b.label)).filter((option: DropdownOption) => option?.label.toLowerCase().includes(query.toLowerCase())) ?? [], [query]);

  const activeValue = useAppSelector((state) => selectNodeValue(state, nodeId, label));
  const activeOption = options.find((option) => option.value === activeValue || option.label === activeValue) ?? {
    label: '',
    value: '',
    tooltip: ''
  };

  const rowRenderer = ({ index, key, isScrolling, isVisible, style }) => {
    return (
      <Combobox.Option
        key={key}
        style={style}
        value={filteredOptions[index]}
        className={({ active }) =>
          `overflow-y-none px-2 flex flex-col justify-center nowheel nodrag cursor-default select-none  ${active ? 'bg-mirage-700 text-slate-400' : 'text-slate-500'}`
        }
      >
        <span
          className="block truncate"
          title={options[index].tooltip !== filteredOptions[index].label ? filteredOptions[index].tooltip : 'No description found'}
        >
          {filteredOptions[index].label}
        </span>
        {filteredOptions[index]?.value &&
          <span
            className="flex truncate leading-3 text-[0.5rem]"
            title={filteredOptions[index].tooltip !== filteredOptions[index].label ? filteredOptions[index].tooltip : 'No description found'}
          >
            {filteredOptions[index].value}
          </span>
        }
      </Combobox.Option>
    )
  }

  return (
    <>
      <Combobox
        className='w-full dropdown-input'
        as='div'
        value={activeOption}
        onChange={(option) => {
          sendJsonMessage({
            action: 'update:node',
            node: {
              id: nodeId,
              [label]: option?.value ? option.value : option.label,
            }
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
          <p className='text-[0.5rem] text-slate-400 whitespace-wrap font-semibold font-display mt-1'>{label}</p>
        </Combobox.Label>
        <div className='relative node-field dropdown !px-0'>
          <Combobox.Input
            ref={dropdownRef}
            onChange={(event) => setQuery(event.target.value)}
            displayValue={(option: DropdownOption) => option.label}
            className='nodrag focus:ring-info-400 mr-4 outline-none px-2'
          />
          <Combobox.Button className='absolute z-[99] -top-px inset-y-0 h-6 w-4 right-0 focus:outline-none'>
            <ChevronUpDownIcon className='h-7 w-7 !text-slate-600 ' aria-hidden='true' />
          </Combobox.Button>
          <Combobox.Options className='absolute nodrag nowheel mr-1 z-10 max-h-80 w-full overflow-hidden rounded-b-md from-mirage-700/90 to-mirage-800/80 from-30%  bg-gradient-to-br py-1 text-[0.6rem] shadow-lg  focus:outline-none sm:text-sm'>
            <List
              rowCount={filteredOptions.length}
              width={dropdownRef?.current?.clientWidth}
              height={filteredOptions?.length <= 3 ? filteredOptions?.length * 54 : 260}
              rowRenderer={rowRenderer}
              rowHeight={({ index }) => filteredOptions[index]?.value ? 54 : 40}
            />
          </Combobox.Options>
        </div>
      </Combobox>
    </>
  );
}
