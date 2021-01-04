import { ICookieStorage } from '@eye8/storage/cookie';

export interface IAuthStorage {
  getAccessToken(): string | null;
  getRefreshToken(): string | null;
  setAccessToken(token: string): void;
  setRefreshToken(token: string): void;
  clearAccessToken(): void;
  clearRefreshToken(): void;
}

export class AuthStorage implements IAuthStorage {
  private storage: ICookieStorage;
  constructor(storage: ICookieStorage) {
    this.storage = storage;
  }

  public getAccessToken() {
    return this.storage.getItem('access_token');
  }

  public getRefreshToken() {
    return this.storage.getItem('refresh_token');
  }

  public setAccessToken(token: string) {
    this.storage.setItem('access_token', token);
  }

  public setRefreshToken(token: string) {
    const expires = new Date();
    expires.setTime(expires.getTime() + 30 * 24 * 3600 * 1000); // 30 days
    this.storage.setItem('refresh_token', token, { expires, path: '/' });
  }

  public clearAccessToken() {
    this.storage.removeItem('access_token');
  }

  public clearRefreshToken() {
    this.storage.removeItem('refresh_token');
  }
}
