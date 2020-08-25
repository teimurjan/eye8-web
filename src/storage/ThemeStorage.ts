import { ICookieStorage } from 'src/storage/cookie/CookieStorage';

export interface IThemeStorage {
  getTheme(): string | null;
  setTheme(version: string): void;
}

export enum Theme {
  Dark = 'dark',
  Light = 'light',
}

export class ThemeStorage implements IThemeStorage {
  private storage: ICookieStorage;
  constructor(storage: ICookieStorage) {
    this.storage = storage;
  }

  public getTheme(): Theme | null {
    return this.storage.getItem('theme') as Theme | null;
  }

  public setTheme(theme: Theme) {
    const expires = new Date();
    expires.setTime(expires.getTime() + 180 * 24 * 3600 * 1000); // 180 days
    this.storage.setItem('refresh_token', theme, { expires, path: '/' });
  }
}
