const { readFileSync } = require('fs');
const { createServer } = require('http');
const { basename } = require('path');
const { parse } = require('url');

const cookie = require('cookie');
const glob = require('glob');
const IntlPolyfill = require('intl');
const Negotiator = require('negotiator');
const next = require('next');

Intl.NumberFormat = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const supportedLanguages = glob.sync('./lang/*.json').map(f => basename(f, '.json'));

const localeDataCache = new Map();
const getLocaleDataScript = locale => {
  const lang = locale.split('-')[0];
  if (!localeDataCache.has(lang)) {
    const localeDataFile = require.resolve(`@formatjs/intl-relativetimeformat/dist/locale-data/${lang}`);
    const localeDataScript = readFileSync(localeDataFile, 'utf8');
    localeDataCache.set(lang, localeDataScript);
  }
  return localeDataCache.get(lang);
};

const detectLocale = req => {
  const cookieLocale = cookie.parse(req.headers.cookie || '').locale;
  if (cookieLocale) {
    const supportedCookieLocale = supportedLanguages.find(l => l === cookieLocale);
    if (supportedCookieLocale) {
      return supportedCookieLocale;
    }
  }

  const negotiator = new Negotiator(req);
  const negotiatedLanguage = negotiator.language(supportedLanguages);

  return negotiatedLanguage || 'ru';
};

const routesMappings = [
  {
    matches: pathname => pathname.startsWith('/admin'),
    route: '/admin',
  },
  {
    matches: pathname => pathname.startsWith('/profile'),
    route: '/profile',
  },
  {
    matches: pathname => pathname.startsWith('/login') || pathname.startsWith('/signup'),
    route: '/',
  },
];

app.prepare().then(() => {
  createServer((req, res) => {
    const detectedLocale = detectLocale(req);
    req.locale = detectedLocale;
    req.localeDataScript = getLocaleDataScript(detectedLocale);

    if (res.statusCode === 404) {
      app.render(req, res, '/notfound');
      return;
    }

    const parsedUrl = parse(req.url, true);
    const { pathname, query } = parsedUrl;

    const routeMapping = routesMappings.find(mapping => mapping.matches(pathname));
    if (routeMapping) {
      app.render(req, res, routeMapping.route, query);
    } else {
      handle(req, res, parsedUrl);
    }
  }).listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
