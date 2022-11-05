import { useCallback, useState } from "react";
import dayjs from "dayjs";

export const useLocalStorageState = <T>(
  key: string,
  ttl: number,
  defaultValue: T
): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(() => {
    const valueInLocalStorage = window.localStorage.getItem(key);
    if (valueInLocalStorage) {
      const { value, expiry } = JSON.parse(valueInLocalStorage);
      if (expiry && expiry > dayjs().unix()) {
        return value;
      }
      window.localStorage.removeItem(key);
    }
    return typeof defaultValue === "function" ? defaultValue() : defaultValue;
  });

  const setLocalStorageState = useCallback(
    (value: T) => {
      setState(value);
      window.localStorage.setItem(
        key,
        JSON.stringify({
          value,
          expiry: dayjs().unix() + ttl,
        })
      );
    },
    [key, ttl]
  );

  return [state, setLocalStorageState];
};
