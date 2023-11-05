
import { Switch } from "@headlessui/react";
import classNames from "classnames";
import { Fragment, forwardRef } from "react";
import { Control, useController } from "react-hook-form";

interface SwitchButtonProps {
  value: boolean;
  onBlur: () => void;
  onChange: (value: boolean) => void;
}

export const SwitchButton = forwardRef<HTMLButtonElement, SwitchButtonProps>(({ value, ...props }, ref) => (
  <Switch
    {...props}
    checked={value}
    as={Fragment}
  >
    <button ref={ref} className={classNames(
      value ? 'bg-info-200' : 'bg-dark-600',
      'relative inline-flex h-7 w-14 flex-shrink-0 ring-1 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-info-200 focus:ring-offset-2 hover:ring-2 active:ring-2'
    )}>
      <span
        aria-hidden='true'
        className={classNames(
          value ? 'translate-x-7 bg-slate-200' : 'translate-x-0 bg-slate-400',
          'inline-block h-6 w-6  transform rounded-full shadow ring-0 transition duration-200 ease-in-out'
        )}
      />
    </button>
  </Switch>
));

export interface InputToggleSwitchProps {
  name: string
  control: Control<any, any>;
  defaultValue?: boolean;
  className?: string
  label?: string
  description?: string
}

export default function InputToggleSwitch({ control, name, defaultValue, className, label, description }: InputToggleSwitchProps) {
  const { field } = useController({
    defaultValue: defaultValue ?? false,
    control,
    name
  })

  return (
    <Switch.Group as='div' className={'px-4 pb-5 sm:px-6 sm:col-span-2 ' + className ?? ''}>
      <Switch.Label as='h3' className='mx-4 text-base font-semibold leading-6 text-slate-200' passive>
        {label ?? ""}
      </Switch.Label>
      <div className='mt-2 mx-4 sm:flex sm:items-start sm:justify-between'>

        {description && (
          <div className='max-w-xl text-sm text-slate-400'>
            <Switch.Description>
              {description}
            </Switch.Description>
          </div>
        )}

        <div className='mt-5 sm:ml-6 sm:-mt-2 sm:flex sm:flex-shrink-0 sm:items-center'>
          <SwitchButton {...field} />
        </div>
      </div>
    </Switch.Group>
  )
}
