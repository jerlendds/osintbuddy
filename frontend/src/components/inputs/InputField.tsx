export default function InputField({ register, name }: InputProps) {
  return (
    <div className='sm:col-span-2'>
      <label htmlFor={name} className='block font-semibold leading-6 mt-4 text-slate-200 pl-8'>
        Name
      </label>
      <div className='mt-2.5 px-8'>
        <input
          id={name}
          className='block w-full hover:ring-2 transition-all duration-100  bg-dark-800  rounded-md border-0 px-3.5 py-2 text-slate-100 shadow-sm ring-1 placeholder:text-gray-400 focus:ring-1 focus:ring-inset outline-none focus:ring-info-200 sm:text-sm sm:leading-6'
          {...register(name)}
        />
      </div>
    </div>
  )
}