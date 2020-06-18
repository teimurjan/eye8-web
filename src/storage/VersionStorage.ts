import { Storage } from 'ttypes/storage';

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
    return this.storage.getItem('appVersion');
  }

  public setVersion(version: string) {
    return this.storage.setItem('appVersion', version);
  }
}
