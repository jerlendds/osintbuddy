import { format } from 'path';
import { RefObject, useEffect, useRef, useState } from 'react';

export const useEffectOnce = (effect: () => void | (() => void)) => {
  const destroyFunc = useRef<void | (() => void)>();
  const effectCalled = useRef(false);
  const renderAfterCalled = useRef(false);
  const [val, setVal] = useState<number>(0);

  if (effectCalled.current) {
    renderAfterCalled.current = true;
  }

  useEffect(() => {
    // only execute the effect first time around
    if (!effectCalled.current) {
      destroyFunc.current = effect();
      effectCalled.current = true;
    }

    // this forces one render after the effect is run
    setVal((val) => val + 1);

    return () => {
      // if the comp didn't render since the useEffect was called,
      // we know it's the dummy React cycle
      if (!renderAfterCalled.current) {
        return;
      }
      if (destroyFunc.current) {
        destroyFunc.current();
      }
    };
  }, []);
};


export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}


export function useComponentVisible(initialIsVisible: boolean) {
  const [isOpen, setIsOpen] = useState(initialIsVisible);
  const ref = useRef(null);

  const handleClickOutside = (event: any) => {
    // @ts-ignore
    if (ref.current && !ref.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);


  return { ref, isOpen, setIsOpen };
}


export function formatAMPM(date: Date) {
  var hours = date.getHours();
  var minutes: string | number = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}


export function formatPGDate(date: string, showAt: boolean = false): string {
  if (date) {
    const dateStr = date.replace(' ', 'T')
    return `${new Date(dateStr).toLocaleDateString()}
     ${showAt ? 'at' : ''}
     ${formatAMPM(new Date(dateStr))}`
  }
  return ''
}


export const isString = (value: any): boolean => typeof value === 'string';


export function useLocalStorage(
  key: string,
  value?: JSONObject | string
) {
  if (value) {
    if (isString(value)) {
      localStorage.setItem(key, value as string)
    } else {
      localStorage.setItem(key, JSON.stringify(value))
    }
    return value
  }
  const rawData = localStorage.getItem(key)
  try {
    if (rawData) return JSON.parse(rawData)
  } catch (error) {
    console.error(error)
  }
  return rawData
}
