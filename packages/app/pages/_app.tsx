import { CacheProvider } from '@emotion/core';
import * as Sentry from '@sentry/node';
import { cache } from 'emotion';
import { AppProps } from 'next/app';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { AuthModal, CacheBuster } from '@eye8/client/components';
import {
  AuthModalStateProvider,
  CategoriesStateProvider,
  CategoriesStateProviderProps,
  RatesStateProvider,
  RatesStateProviderProps,
} from '@eye8/client/state';
import { DIProvider } from '@eye8/di';
import { PageProgressBar, Toaster } from '@eye8/shared/components';
import { ToastsProvider } from '@eye8/shared/context/toast';
import { UserStateProvider } from '@eye8/shared/state';
import { isWindowDefined, safeWindowOperation, logPerformance, getGlobal } from '@eye8/shared/utils';

import CustomHead from '../src/custom-head';
import EntryPoint from '../src/entry-point';
import GlobalStyles from '../src/global-style';
import { useNewDIInstance } from '../src/new-di-instance';
import RequestInterceptor from '../src/request-interceptor';
import ScrollRestorationWrapper from '../src/scroll-restoration';
import ThemeProvider from '../src/theme-provider';

import '@eye8/admin-ui/index.sass';
import '@eye8/client-ui/index.sass';

export function reportWebVitals(metric: object) {
  logPerformance(metric);
}

if (process.env.NODE_ENV === 'development') {
  if (isWindowDefined()) {
    const whyDidYouRender = require('@welldone-software/why-did-you-render');
    whyDidYouRender(React, { trackAllPureComponents: true });
  }
}

const intlCache = createIntlCache();

safeWindowOperation((w) => {
  w.history.scrollRestoration = 'manual';
});

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  release: process.env.RELEASE_VERSION,
});

const CustomNextApp = ({ Component, pageProps }: AppProps) => {
  const locale = getGlobal('__LOCALE__') as Window['__LOCALE__'];
  const messages = getGlobal('__MESSAGES__') as Window['__MESSAGES__'];
  const data = getGlobal('__DATA__') as Window['__DATA__'];

  const di = useNewDIInstance();

  const intl = createIntl(
    {
      locale: locale,
      messages: messages,
    },
    intlCache,
  );

  return (
    <ToastsProvider>
      <CacheProvider value={cache}>
        <DIProvider value={{ di }}>
          <RequestInterceptor>
            <ThemeProvider>
              <RawIntlProvider value={intl}>
                <RatesStateProvider initialProps={data.rates as RatesStateProviderProps['initialProps']}>
                  <UserStateProvider>
                    <CategoriesStateProvider
                      initialProps={data.categories as CategoriesStateProviderProps['initialProps']}
                    >
                      <AuthModalStateProvider>
                        <EntryPoint>
                          <ScrollRestorationWrapper>
                            <CustomHead />
                            <GlobalStyles />
                            <PageProgressBar />
                            <Component {...pageProps} />
                            <Toaster />
                            <AuthModal />
                            <CacheBuster />
                          </ScrollRestorationWrapper>
                        </EntryPoint>
                      </AuthModalStateProvider>
                    </CategoriesStateProvider>
                  </UserStateProvider>
                </RatesStateProvider>
              </RawIntlProvider>
            </ThemeProvider>
          </RequestInterceptor>
        </DIProvider>
      </CacheProvider>
    </ToastsProvider>
  );
};

export default CustomNextApp;
