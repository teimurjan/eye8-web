import { IncomingMessage } from 'http';

import { extractCritical } from 'emotion-server';
import Document, { Head, Main, Html, NextScript, DocumentContext, DocumentProps } from 'next/document';
import React from 'react';

import { IDependenciesFactoryArgs, dependenciesFactory } from '@eye8/di';
import { setGlobal, Locale, logTimeStart, logTimeFinish } from '@eye8/shared/utils';

type IProps = DocumentProps & Then<ReturnType<typeof getInitialProps>>;

const CustomNextDocument = ({ ids, css, localeDataScript, __CUSTOM_DATA__ }: IProps) => {
  const polyfill = `https://cdn.polyfill.io/v3/polyfill.min.js?features=Intl.~locale.${__CUSTOM_DATA__.intl.locale}`;

  const customDataScript = `window.__CUSTOM_DATA__=${JSON.stringify(__CUSTOM_DATA__)};`;

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
        <script id="__CUSTOM_DATA__" dangerouslySetInnerHTML={{ __html: customDataScript }} />
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
  logTimeStart('Document.getInitialProps');
  const statesInitialProps = await getStatesInitialProps(ctx);
  logTimeFinish('Document.getInitialProps');

  const req = ctx.req as (IncomingMessage & { locale: string; localeDataScript: string }) | undefined;

  const locale = req ? req.locale : Locale.Primary;
  const __CUSTOM_DATA__: Window['__CUSTOM_DATA__'] = {
    intl: { messages: require(`../lang/${locale}.json`), locale: locale, isFallback: true },
    states: {
      initialProps: {
        categories: statesInitialProps.categoriesState,
        rates: statesInitialProps.ratesState,
      },
    },
  };

  const page = await ctx.renderPage({
    enhanceApp: (app) => {
      setGlobal('__CUSTOM_DATA__', __CUSTOM_DATA__);
      return app;
    },
  });
  const styles = extractCritical(page.html);

  const props = await Document.getInitialProps(ctx);

  return {
    ...props,
    ...page,
    ...styles,
    __CUSTOM_DATA__,
    localeDataScript: req ? req.localeDataScript : '',
  };
};

CustomNextDocument.getInitialProps = getInitialProps;
CustomNextDocument.renderDocument = Document.renderDocument;

const getStatesInitialProps = async (args: IDependenciesFactoryArgs) => {
  const {
    services: { category: categoryService, rate: rateService },
  } = dependenciesFactory(args);
  try {
    const categoriesPromise = categoryService.getAll();
    const ratesPromise = await rateService.getAllGrouped();
    const [{ entities, result }, rates] = await Promise.all([categoriesPromise, ratesPromise]);
    return {
      categoriesState: { categories: entities.categories, categoriesOrder: result },
      ratesState: { rates },
    };
  } catch (e) {
    console.error(e);
    return {
      categoriesState: { categories: {}, categoriesOrder: [], error: 'errors.common' },
      ratesState: { rates: {}, error: 'errors.common' },
    };
  }
};

export default CustomNextDocument;
