import { extractCritical } from 'emotion-server';
import Document, { Head, Main, Html, NextScript, DocumentProps, DocumentContext } from 'next/document';
import React from 'react';

import { DI } from '@eye8/di';
import { logTimeStart, logTimeFinish, setGlobal } from '@eye8/shared/utils';

import { getNewDIInstance } from '../src/new-di-instance';
import { getRequestCustomData } from '../src/request-custom-data';

type Props = DocumentProps & Then<ReturnType<typeof getInitialProps>>;

const CustomNextDocument = ({ ids, css, locale, localeDataScript, messages, data }: Props) => {
  const polyfill = `https://cdn.polyfill.io/v3/polyfill.min.js?features=Intl.~locale.${locale}`;

  return (
    <Html>
      <Head>
        <style data-emotion-css={ids.join(' ')} dangerouslySetInnerHTML={{ __html: css }} />
      </Head>
      <body>
        <Main />
        <script src={polyfill} />
        <script
          dangerouslySetInnerHTML={{
            __html: localeDataScript,
          }}
        />
        <script
          id="__MESSAGES__"
          dangerouslySetInnerHTML={{ __html: `window.__MESSAGES__=${JSON.stringify(messages)};` }}
        />
        <script id="__DATA__" dangerouslySetInnerHTML={{ __html: `window.__DATA__=${JSON.stringify(data)};` }} />
        <script id="__LOCALE__" dangerouslySetInnerHTML={{ __html: `window.__LOCALE__=${JSON.stringify(locale)};` }} />
        <NextScript />
        <div id="modalRoot"></div>
        <div id="toastRoot"></div>
        <div id="popoverRoot"></div>
        <div id="drawerRoot"></div>
      </body>
    </Html>
  );
};

const getInitialProps = async (ctx: DocumentContext) => {
  const req = ctx.req;
  const { locale, localeDataScript, theme } = getRequestCustomData({ req });

  const di = getNewDIInstance({ locale });

  logTimeStart('Document.getInitialProps');
  const initialData = await getInitialData(di);
  logTimeFinish('Document.getInitialProps');

  const messages = require(`../lang/${locale}.json`);
  const data = {
    categories: initialData.categories,
    rates: initialData.rates,
  };

  const page = await ctx.renderPage({
    enhanceApp: (app) => {
      // Set global data on both server and client so App uses the correct globals
      setGlobal('__MESSAGES__', messages);
      setGlobal('__DATA__', data);
      setGlobal('__LOCALE__', locale);

      return app;
    },
  });
  const styles = extractCritical(page.html);

  const props = await Document.getInitialProps(ctx);

  return {
    ...props,
    ...page,
    ...styles,
    locale,
    localeDataScript,
    theme,
    messages: require(`../lang/${locale}.json`),
    data: {
      categories: initialData.categories,
      rates: initialData.rates,
    },
  };
};

CustomNextDocument.getInitialProps = getInitialProps;
CustomNextDocument.renderDocument = Document.renderDocument;

const getInitialData = async (di: DI) => {
  const {
    service: { category: categoryService, rate: rateService },
  } = di;
  try {
    const categoriesPromise = categoryService.getAll();
    const ratesPromise = rateService.getAllGrouped();
    const [{ entities, result }, rates] = await Promise.all([categoriesPromise, ratesPromise]);
    return {
      categories: { categories: entities.categories, categoriesOrder: result },
      rates: { rates },
    };
  } catch (e) {
    console.error(e);
    return {
      categories: { categories: {}, categoriesOrder: [], error: 'errors.common' },
      rates: { rates: {}, error: 'errors.common' },
    };
  }
};

export default CustomNextDocument;
