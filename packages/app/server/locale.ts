import { readFileSync } from 'fs';
import { basename, join } from 'path';

import cookie from 'cookie';
import { Request, Response } from 'express';
import glob from 'glob';
import IntlPolyfill from 'intl';
import Negotiator from 'negotiator';

export const initIntlPolyfills = () => {
  Intl.NumberFormat = IntlPolyfill.NumberFormat;
  Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
};

const supportedLanguages = glob.sync(join(__dirname, '../lang/*.json')).map((f) => basename(f, '.json'));

const localeDataCache = new Map();

export const getLocaleDataScript = (locale: string) => {
  const lang = locale.split('-')[0];
  if (!localeDataCache.has(lang)) {
    const localeDataFile = require.resolve(`@formatjs/intl-relativetimeformat/dist/locale-data/${lang}`);
    const localeDataScript = readFileSync(localeDataFile, 'utf8');
    localeDataCache.set(lang, localeDataScript);
  }
  return localeDataCache.get(lang);
};

// Use this function if you need locale detection base on the browser's language
export const detectLocale = (req: Request) => {
  const negotiator = new Negotiator(req);
  const negotiatedLanguage = negotiator.language(supportedLanguages);

  return negotiatedLanguage || DEFAULT_LOCALE;
};

const DEFAULT_LOCALE = 'ru';
export const getRequestLocale = (req: Request) => {
  const cookieLocale = cookie.parse(req.headers.cookie || '').locale;
  if (cookieLocale) {
    const supportedCookieLocale = supportedLanguages.find((l) => l === cookieLocale);
    if (supportedCookieLocale) {
      return supportedCookieLocale;
    }
  }

  return DEFAULT_LOCALE;
};

export const localeMiddleware = (req: Request, res: Response, next: Function) => {
  const detectedLocale = getRequestLocale(req);
  req.__CUSTOM_DATA__ = Object.assign(req.__CUSTOM_DATA__ || {}, {
    locale: detectedLocale,
    localeDataScript: getLocaleDataScript(detectedLocale),
  });
  next();
};
