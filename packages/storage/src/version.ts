import { Storage } from '@eye8/storage/types';

export interface IVersionStorage {
  getVersion(): string | null;
  setVersion(version: string): void;
}

export class VersionStorage implements IVersionStorage {
  private storage: Storage;
  constructor(storage: Storage) {
    this.storage = storage;
  }

  public getVersion() {
    return this.storage.getItem('cacheVersion');
  }

  public setVersion(version: string) {
    return this.storage.setItem('cacheVersion', version);
  }
}
