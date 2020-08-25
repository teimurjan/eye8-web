const fs = require('fs');
const path = require('path');
const { parse } = require('url');

const express = require('express');
const LRUCache = require('lru-cache');
const next = require('next');

const { getRequestLocale, initIntlPolyfills, localeMiddleware } = require('./locale');

initIntlPolyfills();

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60, // 1 hour
});

const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(localeMiddleware);

    server.get('/admin(/*)?', (req, res) => {
      return app.render(req, res, '/admin', req.query);
    });

    server.get('/profile(/*)?', (req, res) => {
      return app.render(req, res, '/profile', req.query);
    });

    server.get(['/login', '/signup'], (req, res) => {
      return app.render(req, res, '/', req.query);
    });

    server.get('*', (req, res) => {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      if (pathname === '/sw.js' || pathname.startsWith('/workbox-')) {
        const filePath = path.join(__dirname, '../public', pathname);
        app.serveStatic(req, res, filePath);
      } else {
        renderAndCache(req, res);
      }
    });

    server.listen(port, e => {
      if (e) throw e;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(e => {
    console.error(e.stack);
    process.exit(1);
  });

const isAssetUrl = url => fs.existsSync(path.join(__dirname, '../public', url));
const isNextUrl = url => url.indexOf('_next') !== -1;

const getCacheKey = req => {
  if (isAssetUrl(req.url) || isNextUrl(req.url)) {
    return undefined;
  }

  const detectedLocale = getRequestLocale(req);
  return `{"url":"${req.url}","locale":"${detectedLocale}"}`;
};

const XCACHE_KEY = 'X-Cache';
const XCache = {
  Hit: 'Hit',
  Skip: 'Skip',
  Miss: 'Miss',
};

const renderAndCache = (req, res) => {
  const key = getCacheKey(req);

  if (!key || dev) {
    handle(req, res);
    return;
  }

  if (ssrCache.has(key)) {
    console.log(`Cache Hit: ${key}`);
    res.setHeader(XCACHE_KEY, XCache.Hit);
    res.end(ssrCache.get(key));
    return;
  }

  try {
    // https://github.com/vercel/next.js/issues/12019
    const _resEnd = res.end.bind(res);
    res.end = payload => {
      if (res.statusCode !== 200) {
        console.log(`Cache Skip: ${key}`);
        res.setHeader(XCACHE_KEY, XCache.Skip);
      } else {
        console.log(`Cache Set: ${key}`);
        ssrCache.set(key, payload);
      }
      return _resEnd(payload);
    };

    console.log(`Cache Miss: ${key}`);
    res.setHeader(XCACHE_KEY, XCache.Miss);
    app.render(req, res, req.path, req.query);
  } catch (err) {
    console.error(err);
    app.renderError(err, req, res, req.path, req.query);
  }
};
