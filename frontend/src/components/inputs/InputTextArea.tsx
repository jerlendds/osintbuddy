export default function InputTextarea({ register, name, label, className }: InputProps) {
  return (
    <div className={'sm:col-span-2 ' + className ?? ''}>
      <label htmlFor={name} className='block font-semibold leading-6 mt-4 font-display text-slate-400 pl-8'>
        {label}
      </label>
      <div className='form-input-wrapper mx-8 pl-3.5 pb-0 pr-0'>
        <textarea
          id={name}
          rows={2}
          className='form-input'
          {...register(name)}
        />
      </div>
    </div>
  )
}
