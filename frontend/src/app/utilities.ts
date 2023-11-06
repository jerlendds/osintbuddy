
export function formatTime(date: Date) {
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
    return `${new Date(dateStr).toDateString()}${showAt ? ' at ' : ' '}${formatTime(new Date(dateStr))}`
  }
  return ''
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export const isString = (value: any): boolean => typeof value === 'string';

export function lStorage(
  key: string,
  value?: JSONObject | string
) {
  if (value) {
    // console.debug('useLocalStorage: ', key, value)
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
