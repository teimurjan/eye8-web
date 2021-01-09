import { getCurrentTimestamp, objectWithout } from '@eye8/shared/utils';
import { Storage } from '@eye8/storage/types';

type SetOptions = { expireIn: number };

type Listener = (key: string, value: object | undefined, options?: SetOptions) => void;

export interface StateCacheStorage {
  get(key: string): object | null;
  set(key: string, value: object | undefined, options?: SetOptions): void;
  clear(key: string): void;
  clearAll(): void;
  addChangeListener(listener: Listener): void;
}

export default class implements StateCacheStorage {
  private listeners: Set<Listener>;
  private storage: Storage;
  constructor(storage: Storage) {
    this.storage = storage;
    this.listeners = new Set();
  }

  private getCachedState() {
    const cachedState = this.storage.getItem('cachedState') || '{}';
    return JSON.parse(cachedState);
  }

  public get(key: string) {
    const value = this.getCachedState()[key];
    if (value && value.timestamp && value.expireIn) {
      const currentTimestamp = getCurrentTimestamp();
      if (currentTimestamp - value.timestamp > value.expireIn) {
        this.clear(key);
        return null;
      }

      return objectWithout(value, 'timestamp', 'expireIn');
    }

    return value;
  }

  public set: StateCacheStorage['set'] = (key, value, options) => {
    const cachedState = this.getCachedState();
    if (options && options.expireIn) {
      const currentTimestamp = getCurrentTimestamp();
      cachedState[key] = { ...value, timestamp: currentTimestamp, expireIn: options.expireIn };
    } else {
      cachedState[key] = value;
    }
    this.storage.setItem('cachedState', JSON.stringify(cachedState));
    this.listeners.forEach((l) => l(key, value, options));
  };

  public clear(key: string) {
    const cachedState = this.getCachedState();
    cachedState[key] = undefined;
    this.set(key, undefined);
  }

  public clearAll() {
    this.storage.removeItem('cachedState');
  }

  public addChangeListener(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}
