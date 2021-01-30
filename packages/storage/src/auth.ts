import { safeWindow } from '@eye8/shared/utils';
import { CookieStorage } from '@eye8/storage/cookie';

export interface AuthStorage {
  getAccessToken(): string | null;
  setAccessToken(token: string): void;
  clearAccessToken(): void;
}

export default class implements AuthStorage {
  private storage: CookieStorage;
  constructor(storage: CookieStorage) {
    this.storage = storage;
  }

  public getAccessToken() {
    return this.storage.getItem('access_token');
  }

  private getCookieOptions = () =>
    process.env.NODE_ENV === 'production' ? { domain: safeWindow((w) => w.location.host, undefined) } : {};

  public setAccessToken(token: string) {
    this.storage.setItem('access_token', token, this.getCookieOptions());
  }

  public clearAccessToken() {
    this.setAccessToken('loggedout');
  }
}
