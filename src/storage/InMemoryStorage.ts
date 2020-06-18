import { Storage } from 'ttypes/storage';

export class InMemoryStorage implements Storage {
  private storage: { [key: string]: string | null } = {};

  get length() {
    return Object.keys(this.storage).length;
  }

  clear = () => {
    this.storage = {};
  };

  getItem = (key: string) => this.storage[key];

  key = (index: number) => Object.keys(this.storage)[index];

  removeItem = (key: string) => {
    delete this.storage[key];
  };

  setItem = (key: string, value: string) => {
    this.storage[key] = value;
  };
}
