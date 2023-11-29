export default function InputField({ register, name, label, className }: InputProps) {
  return (
    <div className={'sm:col-span-2 ' + className ?? ''}>
      <label htmlFor={name} className='block font-display font-semibold leading-6 mt-4 text-slate-400 pl-8'>
        {label ?? ""}
      </label>
      <div className='mt-2.5 form-input-wrapper mx-8'>
        <input
          id={name}
          className='form-input'
          {...register(name)}
        />
      </div>
    </div>
  )
}