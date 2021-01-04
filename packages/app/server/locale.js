const { readFileSync } = require('fs');
const { basename, join } = require('path');

const cookie = require('cookie');
const glob = require('glob');
const IntlPolyfill = require('intl');
const Negotiator = require('negotiator');

module.exports.initIntlPolyfills = () => {
  Intl.NumberFormat = IntlPolyfill.NumberFormat;
  Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;
};

const supportedLanguages = glob.sync(join(__dirname, '../lang/*.json')).map((f) => basename(f, '.json'));

const localeDataCache = new Map();

module.exports.getLocaleDataScript = (locale) => {
  const lang = locale.split('-')[0];
  if (!localeDataCache.has(lang)) {
    const localeDataFile = require.resolve(`@formatjs/intl-relativetimeformat/dist/locale-data/${lang}`);
    const localeDataScript = readFileSync(localeDataFile, 'utf8');
    localeDataCache.set(lang, localeDataScript);
  }
  return localeDataCache.get(lang);
};

// Use this function if you need locale detection base on the browser's language
module.exports.detectLocale = (req) => {
  const negotiator = new Negotiator(req);
  const negotiatedLanguage = negotiator.language(supportedLanguages);

  return negotiatedLanguage || DEFAULT_LOCALE;
};

const DEFAULT_LOCALE = 'ru';
module.exports.getRequestLocale = (req) => {
  const cookieLocale = cookie.parse(req.headers.cookie || '').locale;
  if (cookieLocale) {
    const supportedCookieLocale = supportedLanguages.find((l) => l === cookieLocale);
    if (supportedCookieLocale) {
      return supportedCookieLocale;
    }
  }

  return DEFAULT_LOCALE;
};

module.exports.localeMiddleware = (req, res, next) => {
  const detectedLocale = module.exports.getRequestLocale(req);
  req.locale = detectedLocale;
  req.localeDataScript = module.exports.getLocaleDataScript(detectedLocale);
  next();
};
