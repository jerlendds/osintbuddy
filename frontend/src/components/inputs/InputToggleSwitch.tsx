
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
      value ? 'bg-primary-400' : 'bg-dark-600',
      'relative inline-flex h-7 w-14 flex-shrink-0 ring-3 ring-offset-0 cursor-pointer rounded-full border-2 border-primary transition-colors duration-200 ease-in-out focus:outline-none focus:ring-3 focus:ring-primary-200 focus:ring-offset-3 hover:ring-3 ring-primary-400 active:ring-3'
    )}>
      <span
        aria-hidden='true'
        className={classNames(
          value ? 'translate-x-7 bg-slate-400' : 'translate-x-0 bg-slate-400',
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
    <Switch.Group as='div' className={' pb-5  sm:col-span-2 ' + className ?? ''}>
      <Switch.Label as='h3' className=' font-display font-semibold leading-6 text-slate-400' passive>
        {label ?? ""}
      </Switch.Label>
      <div className='mt-2 sm:flex sm:items-start sm:justify-between'>
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
