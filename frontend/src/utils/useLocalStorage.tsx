import { useState } from "react";
//refer to usehooks.com/useLocalStorage

export function getStorageItem(key: any, initialValue: any) {
  try {
    const item = window.localStorage.getItem(key); // Get from local storage by key
    return item ? JSON.parse(item) : initialValue; // Parse stored json or if none return initialValue
  } catch (error) {
    // If error also return initialValue
    console.log(error);
    return initialValue;
  }
}

export function setStorageItem(key: any, value: any) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.log(error);
  }
}

export default function useLocalStorage(key: any, initialValue: any) {
  //get value from localstorage and register it as status initial value
  const [storedValue, setStoredValue] = useState(() => {
    return getStorageItem(key, initialValue);
  });

  //set "state" and "localstorage"
  const setValue = (value: any) => {
    // Allow value to be a function so we have same API as useState
    const valueToStore = value instanceof Function ? value(storedValue) : value; // Save state
    setStoredValue(valueToStore); // Save to local storage

    setStorageItem(key, valueToStore);
  };

  return [storedValue, setValue];
}
