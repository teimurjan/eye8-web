import fs from 'fs';
import path from 'path';
import { ParsedUrlQuery } from 'querystring';
import { parse, UrlWithParsedQuery } from 'url';

import express, { Request, Response } from 'express';
import LRUCache from 'lru-cache';
import next from 'next';

import { authMiddleware } from './auth';
import { initIntlPolyfills, localeMiddleware } from './locale';
import { themeMiddleware } from './theme';

initIntlPolyfills();

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const ssrCache = new LRUCache({
  max: 100,
  maxAge: 1000 * 60 * 60, // 1 hour
});

const handle = app.getRequestHandler();

const staticAssetsMiddleware = (req: Request, res: Response, next: () => void) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;

  if (pathname === '/sw.js' || pathname?.startsWith('/workbox-')) {
    const filePath = path.join(__dirname, '../public', pathname);
    app.serveStatic(req, res, filePath);
  } else if (isAssetUrl(req.url) || isNextUrl(req.url)) {
    handle(req, res, parsedUrl);
  } else {
    next();
  }
};

app
  .prepare()
  .then(() => {
    const server = express();

    const middlewares = [authMiddleware, localeMiddleware, themeMiddleware];

    server.get('/admin(/*)?', ...middlewares, (req, res) => {
      return app.render(req, res, '/admin', req.query as ParsedUrlQuery);
    });

    server.get('/profile(/*)?', ...middlewares, (req, res) => {
      return app.render(req, res, '/profile', req.query as ParsedUrlQuery);
    });

    server.get(['/login', '/signup'], ...middlewares, (req, res) => {
      return app.render(req, res, '/', req.query as ParsedUrlQuery);
    });

    server.get('*', staticAssetsMiddleware, ...middlewares, (req, res) => {
      const parsedUrl = parse(req.url, true);
      handleCache(req, res, parsedUrl);
    });

    server.listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch((e) => {
    console.error(e.stack);
    process.exit(1);
  });

const isAssetUrl = (url: string) => fs.existsSync(path.join(__dirname, '../public', url));
const isNextUrl = (url: string) => url.indexOf('_next') !== -1;

const getCacheKey = (req: Request) => `{"url":"${req.url}","locale":"${req.__CUSTOM_DATA__.locale}"}`;

const XCACHE_KEY = 'X-Cache';
const XCache = {
  Hit: 'Hit',
  Skip: 'Skip',
  Miss: 'Miss',
};

const handleCache = (req: Request, res: Response, parsedUrl: UrlWithParsedQuery) => {
  const key = getCacheKey(req);

  if (dev) {
    handle(req, res, parsedUrl);
    return;
  }

  if (ssrCache.has(key)) {
    res.setHeader(XCACHE_KEY, XCache.Hit);
    res.end(ssrCache.get(key));
    return;
  }

  try {
    // https://github.com/vercel/next.js/issues/12019
    const _resEnd = res.end.bind(res);
    res.end = <T>(payload: T) => {
      if (res.statusCode !== 200) {
        res.setHeader(XCACHE_KEY, XCache.Skip);
      } else {
        ssrCache.set(key, payload);
      }
      return _resEnd(payload);
    };

    res.setHeader(XCACHE_KEY, XCache.Miss);
    app.render(req, res, req.path, req.query as ParsedUrlQuery);
  } catch (err) {
    console.error(err);
    app.renderError(err, req, res, req.path, req.query as ParsedUrlQuery);
  }
};
