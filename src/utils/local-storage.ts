const getLocalStorageItem = <T = unknown>(key: string): T | null => {
  const value = window.localStorage.getItem(key);
  if (!value) {
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return JSON.parse(value);
};

const setLocalStorageItem = (key: string, value: unknown) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

const removeLocalStorageItem = (key: string) => {
  window.localStorage.removeItem(key);
};

export { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem };
