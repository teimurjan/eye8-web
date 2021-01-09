import { AuthStorage } from '@eye8/storage/auth';
import { IntlStorage } from '@eye8/storage/intl';

interface Headers {
  [key: string]: string | null | undefined;
}

export interface HeadersManager {
  getHeaders(): Headers;
}

export default class implements HeadersManager {
  private authStorage: AuthStorage;
  private intlStorage: IntlStorage;

  constructor(authStorage: AuthStorage, intlStorage: IntlStorage) {
    this.authStorage = authStorage;
    this.intlStorage = intlStorage;
  }

  private filterHeaders = (headers: Headers) =>
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
