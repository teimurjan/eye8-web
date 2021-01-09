import { CacheProvider } from '@emotion/core';
import * as Sentry from '@sentry/node';
import { cache } from 'emotion';
import { AppProps, AppContext } from 'next/app';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { AuthModal } from '@eye8/client/components/auth-modal';
import { CacheBuster } from '@eye8/client/components/cache-buster';
import { AuthModalStateProvider } from '@eye8/client/state/auth-modal';
import { CategoriesStateProvider, ProviderProps as CategoriesStateProviderProps } from '@eye8/client/state/categories';
import { RatesStateProvider, ProviderProps as RatesStateProviderProps } from '@eye8/client/state/rates';
import { dependenciesFactory, DependenciesFactoryArgs, DIProvider } from '@eye8/di';
import { PageProgressBar, Toaster } from '@eye8/shared/components';
import { ToastsProvider } from '@eye8/shared/context/toast';
import { UserStateProvider } from '@eye8/shared/state/user';
import { isWindowDefined, safeWindowOperation, getGlobal, logPerformance } from '@eye8/shared/utils';

import AuthInterceptor from '../src/auth-interceptor';
import { CustomHead } from '../src/custom-head';
import { EntryPoint } from '../src/entry-point';
import { GlobalStyles } from '../src/global-style';
import { ScrollRestorationWrapper } from '../src/scroll-restoration';
import { ThemeProvider } from '../src/theme-provider';

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

const _DEPENDENCIES_SERVER_PROPS: DependenciesFactoryArgs = {};

const CustomNextApp = ({ Component, pageProps, ...rest }: AppProps) => {
  const customData = getGlobal('__CUSTOM_DATA__') as Window['__CUSTOM_DATA__'];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dependencies = React.useMemo(() => dependenciesFactory(_DEPENDENCIES_SERVER_PROPS), []);

  const intl = createIntl(
    {
      locale: customData.intl.locale,
      messages: customData.intl.messages,
    },
    intlCache,
  );

  return (
    <ToastsProvider>
      <CacheProvider value={cache}>
        <DIProvider value={{ dependencies }}>
          <AuthInterceptor>
            <ThemeProvider>
              <RawIntlProvider value={intl}>
                <RatesStateProvider
                  initialProps={customData.states.initialProps.rates as RatesStateProviderProps['initialProps']}
                >
                  <UserStateProvider>
                    <CategoriesStateProvider
                      initialProps={
                        customData.states.initialProps.categories as CategoriesStateProviderProps['initialProps']
                      }
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
          </AuthInterceptor>
        </DIProvider>
      </CacheProvider>
    </ToastsProvider>
  );
};

const getInitialProps = ({ ctx }: AppContext) => {
  _DEPENDENCIES_SERVER_PROPS.req = ctx.req;
  _DEPENDENCIES_SERVER_PROPS.res = ctx.res;

  return {};
};

CustomNextApp.getInitialProps = getInitialProps;

export default CustomNextApp;
