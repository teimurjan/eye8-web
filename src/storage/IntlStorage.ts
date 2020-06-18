import { ICookieStorage } from 'src/storage/cookie/CookieStorage';

export interface IIntlStorage {
  getLocale(): string | null;
  setLocale(locale: string): void;
  clearLocale(): void;
}

export class IntlStorage implements IIntlStorage {
  private storage: ICookieStorage;
  constructor(storage: ICookieStorage) {
    this.storage = storage;
  }

  public getLocale() {
    return this.storage.getItem('locale');
  }

  public setLocale(locale: string) {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    this.storage.setItem('locale', locale, { path: '/', expires });
  }

  public clearLocale() {
    this.storage.removeItem('locale');
  }
}
