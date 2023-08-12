import { ChangeEvent } from 'react';

export default function NodeInputField({
  value,
  onValueUpdate,
  placeholder,
}: {
  value: any;
  onValueUpdate: Function;
  placeholder: string;
}) {
  return (
    <form className='flex items-start flex-col'>
      <p className='node-label'>Query</p>
      <div className='flex items-center mb-1'>
        <div className='node-field'>
          <input
            data-label='query'
            type='text'
            onChange={(event: ChangeEvent<HTMLInputElement>) => onValueUpdate(event)}
            value={value}
            placeholder={placeholder}
          />
        </div>
      </div>
    </form>
  );
}
