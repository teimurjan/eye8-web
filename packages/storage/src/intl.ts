import { CookieStorage } from '@eye8/storage/cookie';

export interface IntlStorage {
  getLocale(): string | null;
  setLocale(locale: string): void;
  clearLocale(): void;
}

export default class implements IntlStorage {
  private storage: CookieStorage;
  constructor(storage: CookieStorage) {
    this.storage = storage;
  }

  public getLocale() {
    return this.storage.getItem('locale');
  }

  public setLocale(locale: string) {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    this.storage.setItem('locale', locale, { expires });
  }

  public clearLocale() {
    this.storage.removeItem('locale');
  }
}
