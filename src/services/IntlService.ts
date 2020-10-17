import * as intlStorage from 'src/storage/IntlStorage';

export interface IIntlService {
  getLocale(): string | null;
  setLocale(locale: string): void;
}

export class IntlService implements IIntlService {
  private storage: intlStorage.IIntlStorage;

  constructor(storage: intlStorage.IIntlStorage) {
    this.storage = storage;
  }

  public getLocale: IIntlService['getLocale'] = () => this.storage.getLocale();

  public setLocale: IIntlService['setLocale'] = (locale) => this.storage.setLocale(locale);
}
