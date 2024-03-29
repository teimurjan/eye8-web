import Cookies, { CookieSetOptions, CookieGetOptions } from 'universal-cookie';

import { Storage } from '@eye8/storage/types';

const cookies = new Cookies();

export interface CookieStorage extends Storage {
  length: number;
  clear(): void;
  getItem(key: string, options?: CookieGetOptions): string | null;
  key(index: number): string | null;
  removeItem(key: string, options?: CookieSetOptions): void;
  setItem(key: string, value: string, options?: CookieSetOptions): void;
  [key: string]: any;
}

export const getCookieDomain = () =>
  process.env.PUBLIC_URL ? `.${process.env.PUBLIC_URL.replace('https://', '').replace('www.', '')}` : undefined;

export default class implements CookieStorage {
  get length() {
    return Object.keys(cookies.getAll()).length;
  }

  private getStaticOptions = () => ({ domain: getCookieDomain(), path: '/' });

  key = (i: number) => Object.keys(cookies.getAll())[i];

  removeItem = (key: string, options: CookieSetOptions = {}) => {
    cookies.remove(key, { ...this.getStaticOptions(), ...options });
  };

  clear = () => {
    Object.keys(cookies.getAll()).forEach((key) => this.removeItem(key));
  };

  getItem = (key: string, options?: CookieGetOptions) => {
    const item = cookies.get(key, options);
    return item ? item : null;
  };

  setItem = (key: string, value: string, options: CookieSetOptions = {}) => {
    cookies.set(key, value, { ...this.getStaticOptions(), ...options });
  };
}
