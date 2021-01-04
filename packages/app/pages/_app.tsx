import { CacheProvider } from '@emotion/core';
import * as Sentry from '@sentry/node';
import { cache } from 'emotion';
import { AppProps, AppContext } from 'next/app';
import React from 'react';
import { createIntl, createIntlCache, RawIntlProvider } from 'react-intl';

import { AuthModal } from '@eye8/client/components/auth-modal';
import { CacheBuster } from '@eye8/client/components/cache-buster';
import { AuthModalStateProvider } from '@eye8/client/state/auth-modal';
import {
  CategoriesStateProvider,
  IProviderProps as ICategoriesStateProviderProps,
} from '@eye8/client/state/categories';
import { RatesStateProvider, IProviderProps as IRatesStateProviderProps } from '@eye8/client/state/rates';
import { dependenciesFactory, IDependenciesFactoryArgs, DIProvider } from '@eye8/di';
import { PageProgressBar, Toaster } from '@eye8/shared/components';
import { UserStateProvider } from '@eye8/shared/state/user';
import { isWindowDefined, safeWindowOperation, getGlobal, logPerformance } from '@eye8/shared/utils';

import { CustomHead } from '../src/custom-head';
import { EntryPoint } from '../src/entry-point';
import { GlobalStyles } from '../src/global-style';
import { ScrollRestorationWrapper } from '../src/scroll-restoration';
import { ThemeProvider } from '../src/theme-provider';

import '@eye8/admin-ui/index.sass';

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

const _DEPENDENCIES_SERVER_PROPS: IDependenciesFactoryArgs = {};

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
    <CacheProvider value={cache}>
      <DIProvider value={{ dependencies }}>
        <ThemeProvider>
          <RawIntlProvider value={intl}>
            <RatesStateProvider
              initialProps={customData.states.initialProps.rates as IRatesStateProviderProps['initialProps']}
            >
              <UserStateProvider>
                <CategoriesStateProvider
                  initialProps={
                    customData.states.initialProps.categories as ICategoriesStateProviderProps['initialProps']
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
      </DIProvider>
    </CacheProvider>
  );
};

const getInitialProps = ({ ctx }: AppContext) => {
  _DEPENDENCIES_SERVER_PROPS.req = ctx.req;
  _DEPENDENCIES_SERVER_PROPS.res = ctx.res;

  return {};
};

CustomNextApp.getInitialProps = getInitialProps;

export default CustomNextApp;
