export default function InputField({ register, name, label, className, description }: InputProps) {
  return (
    <div className={'sm:col-span-2 ' + className ?? ''}>
      <label htmlFor={name} className='block font-display font-semibold leading-6 mt-4 text-slate-400'>
        {label ?? ""}

      </label>
      {description && (
        <span className="text-sm text-slate-500 ">
          {description}
        </span>
      )}
      <div className='mt-2.5 form-input-wrapper'>
        <input
          id={name}
          className='form-input'
          {...register(name)}
        />
      </div>
    </div>
  )
}