import { IncomingMessage, ServerResponse } from 'http';

import Cookies, { CookieSetOptions } from 'universal-cookie';

import { getCookieDomain } from '@eye8/shared/utils';
import { ICookieStorage } from '@eye8/storage/cookie';

export class ServerCookieStorage implements ICookieStorage {
  private res: ServerResponse;
  private cookies: Cookies;

  constructor(req: IncomingMessage, res: ServerResponse) {
    this.res = res;
    this.cookies = new Cookies(req.headers.cookie);
  }

  // Incoming cookies length
  get length() {
    return Object.keys(this.cookies).length;
  }

  // Incoming cookies key by index
  key = (i: number) => Object.keys(this.cookies)[i];

  // Search outcoming cookies by key then search incoming as fallback
  getItem = (key: string) => this.cookies.get(key);

  // Set both cookies so the search works correctly
  setItem = (key: string, value: string, options: CookieSetOptions = { path: '/' }) => {
    this.cookies.set(key, value, options);
    const expires = options.expires ? `Expires=${options.expires.toUTCString()}` : '';
    const path = options.path ? `Path=${options.path}` : '';
    const cookieDomain = getCookieDomain();
    const domain = cookieDomain ? `Domain=${cookieDomain}` : '';
    const currentCookieHeader = (this.res.getHeader('Set-Cookie') as string[]) || [];
    const newCookieHeader = value ? [[`${key}=${value}`, path, domain, expires].join('; ')] : [];
    const finalCookieHeader = [...currentCookieHeader, ...newCookieHeader];
    const finalCookieHeaderWithoutDuplicates = finalCookieHeader.filter(
      (cookie, i) => finalCookieHeader.indexOf(cookie) === i,
    );

    this.res.setHeader('Set-Cookie', finalCookieHeaderWithoutDuplicates);
  };

  // Remove outcoming cookie
  removeItem = (key: string) => {
    this.setItem(key, '');
  };

  // Clear outcoming cookies
  clear = () => {
    Object.keys(this.cookies.getAll()).forEach(this.removeItem);
  };
}
