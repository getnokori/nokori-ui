import Store from 'electron-store'
import { electron } from '../utils/platform'
const windowStorage = window.localStorage
const electronStorage = new Store()

// When passed a key name and value, will add that key to the storage,
// or update that key's value if it already exists.
const set = async (key: string, value: any): Promise<void> => {
  if (electron) {
    electronStorage.set(key, value)
    return
  }
  windowStorage.setItem(key, value)
  return
}

// When passed a key name, will return that key's value.
const get = async (key: string): Promise<any> => {
  if (electron) {
    return electronStorage.get(key)
  }

  return windowStorage.getItem(key)
}

// When passed a key name, will remove that key from the storage.
const remove = async (key: string): Promise<void> => {
  if (electron) {
    return electronStorage.delete(key)
  }
  return windowStorage.removeItem(key)
}

// When invoked, will empty all keys out of the storage.
const clear = async (): Promise<void> => {
  if (electron) {
    return electronStorage.clear()
  }
  return windowStorage.clear()
}

export default {
  set,
  get,
  remove,
  clear
}
