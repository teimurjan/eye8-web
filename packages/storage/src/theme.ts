import { Theme } from '@eye8/shared/utils';
import { CookieStorage } from '@eye8/storage/cookie';

export interface ThemeStorage {
  getTheme(): Theme | null;
  setTheme(version: string): void;
  toggle(): void;
}

export default class implements ThemeStorage {
  private storage: CookieStorage;
  constructor(storage: CookieStorage) {
    this.storage = storage;
  }

  public getTheme(): Theme | null {
    return this.storage.getItem('theme') as Theme | null;
  }

  public setTheme(theme: Theme) {
    const expires = new Date();
    expires.setTime(expires.getTime() + 180 * 24 * 3600 * 1000); // 180 days
    this.storage.setItem('theme', theme, { expires, path: '/' });
  }

  public toggle() {
    const theme = this.getTheme();
    this.setTheme(!theme || theme === Theme.Light ? Theme.Dark : Theme.Light);
  }
}
