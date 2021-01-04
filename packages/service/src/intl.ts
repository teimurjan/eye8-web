import { IIntlStorage } from '@eye8/storage/intl';

export interface IIntlService {
  getLocale(): string | null;
  setLocale(locale: string): void;
}

export class IntlService implements IIntlService {
  private storage: IIntlStorage;

  constructor(storage: IIntlStorage) {
    this.storage = storage;
  }

  public getLocale: IIntlService['getLocale'] = () => this.storage.getLocale();

  public setLocale: IIntlService['setLocale'] = (locale) => this.storage.setLocale(locale);
}
