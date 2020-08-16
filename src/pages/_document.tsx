import { IncomingMessage } from 'http';

import { extractCritical } from 'emotion-server';
import Document, { Head, Main, NextScript, DocumentContext, DocumentProps } from 'next/document';
import * as React from 'react';

import { IDependenciesFactoryArgs, dependenciesFactory } from 'src/DI/DependenciesContainer';
import { setGlobal } from 'src/utils/global';
import { logTimeStart, logTimeFinish } from 'src/utils/log';

type IProps = DocumentProps & Then<ReturnType<typeof getInitialProps>>;

const CustomNextDocument = ({ ids, css, localeDataScript, __CUSTOM_DATA__ }: IProps) => {
  const polyfill = `https://cdn.polyfill.io/v3/polyfill.min.js?features=Intl.~locale.${__CUSTOM_DATA__.intl.locale}`;

  const customDataScript = `window.__CUSTOM_DATA__=${JSON.stringify(__CUSTOM_DATA__)};`;

  return (
    <html>
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
    </html>
  );
};

const getInitialProps = async (ctx: DocumentContext) => {
  logTimeStart('Document.getInitialProps');
  const statesInitialProps = await getStatesInitialProps(ctx);
  logTimeFinish('Document.getInitialProps');

  const req = ctx.req as (IncomingMessage & { locale: string; localeDataScript: string }) | undefined;

  const locale = req ? req.locale : 'en';
  const __CUSTOM_DATA__: Window['__CUSTOM_DATA__'] = {
    intl: { messages: require(`../../lang/${locale}.json`), locale: locale, isFallback: true },
    states: {
      initialProps: {
        intl: statesInitialProps.intlState,
        categories: statesInitialProps.categoriesState,
        rates: statesInitialProps.ratesState,
      },
    },
  };

  const page = await ctx.renderPage({
    enhanceApp: app => {
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
    services: { category: categoryService, intl: intlService, rate: rateService },
  } = dependenciesFactory(args);
  try {
    const categoriesPromise = categoryService.getAll();
    const availableLocalesPromise = intlService.getAvailableLocales();
    const ratesPromise = await rateService.getAllGrouped();
    const [{ entities, result }, availableLocales, rates] = await Promise.all([
      categoriesPromise,
      availableLocalesPromise,
      ratesPromise,
    ]);
    return {
      categoriesState: { categories: entities.categories, categoriesOrder: result },
      intlState: { availableLocales },
      ratesState: { rates },
    };
  } catch (e) {
    console.error(e);
    return {
      categoriesState: { categories: {}, categoriesOrder: [], error: 'errors.common' },
      intlState: { availableLocales: [], error: 'errors.common' },
      ratesState: { rates: {}, error: 'errors.common' },
    };
  }
};

export default CustomNextDocument;
