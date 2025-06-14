export function useLocalStorage(key: string) {
  function setItem(value: unknown) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Failed to set item in local storage: ", e);
    }
  }

  function getItem() {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : undefined;
    } catch (e) {
      console.error("Failed to get item from local storage: ", e);
    }
  }

  function removeItem() {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.error("Failed to remove item from local storage: ", e);
    }
  }

  return { getItem, setItem, removeItem };
}
