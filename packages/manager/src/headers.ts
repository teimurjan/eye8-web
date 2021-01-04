import { IAuthStorage } from '@eye8/storage/auth';
import { IIntlStorage } from '@eye8/storage/intl';

interface IHeaders {
  [key: string]: string | null | undefined;
}

export interface IHeadersManager {
  getHeaders(): IHeaders;
}

export class HeadersManager implements IHeadersManager {
  private authStorage: IAuthStorage;
  private intlStorage: IIntlStorage;

  constructor(authStorage: IAuthStorage, intlStorage: IIntlStorage) {
    this.authStorage = authStorage;
    this.intlStorage = intlStorage;
  }

  private filterHeaders = (headers: IHeaders) =>
    Object.keys(headers).reduce(
      (acc, headerKey) => (headers[headerKey] ? { ...acc, [headerKey]: headers[headerKey] } : acc),
      {},
    );

  public getHeaders() {
    const locale = this.intlStorage.getLocale();
    const accessToken = this.authStorage.getAccessToken();
    return this.filterHeaders({
      'X-Locale': locale,
      Authorization: accessToken ? `Bearer ${accessToken}` : undefined,
    });
  }
}
