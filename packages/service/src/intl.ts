import { IntlStorage } from '@eye8/storage/intl';

export interface IntlService {
  getLocale(): string | null;
  setLocale(locale: string): void;
}

export default class implements IntlService {
  private storage: IntlStorage;

  constructor(storage: IntlStorage) {
    this.storage = storage;
  }

  public getLocale: IntlService['getLocale'] = () => this.storage.getLocale();

  public setLocale: IntlService['setLocale'] = (locale) => this.storage.setLocale(locale);
}
