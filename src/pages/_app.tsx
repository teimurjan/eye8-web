import { CacheProvider } from '@emotion/core';
import * as Sentry from '@sentry/node';
import whyDidYouRender from '@welldone-software/why-did-you-render';
import { cache } from 'emotion';
import { ThemeProvider } from 'emotion-theming';
import { AppProps } from 'next/app';
import React from 'react';
import { createIntl, createIntlCache } from 'react-intl';

import { AuthModal } from 'src/_app/AuthModal';
import { CustomHead } from 'src/_app/CustomHead';
import { EntryPoint } from 'src/_app/EntryPoint';
import { GlobalStyles } from 'src/_app/GlobalStyle';
import { LoadingOverlay } from 'src/_app/LoadingOverlay';
import { Toaster } from 'src/_app/Toaster';
import { CacheBuster } from 'src/components/CacheBuster';
import { PageProgressBar } from 'src/components/common-ui/PageProgressBar/PageProgressBar';
import { dependenciesFactory } from 'src/DI/DependenciesContainer';
import { DIProvider } from 'src/DI/DI';
import { AppStateProvider } from 'src/state/AppState';
import { AuthModalStateProvider } from 'src/state/AuthModalState';
import { CategoriesStateProvider, IProviderProps as ICategoriesStateProviderProps } from 'src/state/CategoriesState';
import { IntlStateProvider, IProviderProps as IIntlStateProviderProps } from 'src/state/IntlState';
import { RatesStateProvider, IProviderProps as IRatesStateProviderProps } from 'src/state/RatesState';
import { UserStateProvider } from 'src/state/UserState';
import { defaultTheme } from 'src/themes';
import { safeWindowOperation, isWindowDefined } from 'src/utils/dom';
import { getGlobal } from 'src/utils/global';
import { logPerformance } from 'src/utils/log';

import 'bulma/css/bulma.css';

export function reportWebVitals(metric: object) {
  logPerformance(metric);
}

if (isWindowDefined() && process.env.NODE_ENV === 'development') {
  whyDidYouRender(React, { trackAllPureComponents: true });
}

const intlCache = createIntlCache();
const dependencies = dependenciesFactory();

safeWindowOperation(w => {
  w.history.scrollRestoration = 'manual';
});

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  enabled: process.env.NODE_ENV === 'production',
  release: process.env.RELEASE_VERSION,
});

const CustomNextApp = ({ Component, pageProps }: AppProps) => {
  const customData = getGlobal('__CUSTOM_DATA__') as Window['__CUSTOM_DATA__'];

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
        <ThemeProvider theme={defaultTheme}>
          <AppStateProvider>
            <IntlStateProvider
              initialProps={customData.states.initialProps.intl as IIntlStateProviderProps['initialProps']}
              intl={intl}
            >
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
                        <>
                          <CustomHead />
                          <GlobalStyles />
                          <PageProgressBar />
                          <Component {...pageProps} />
                          <LoadingOverlay />
                          <Toaster />
                          <AuthModal />
                          <CacheBuster />
                        </>
                      </EntryPoint>
                    </AuthModalStateProvider>
                  </CategoriesStateProvider>
                </UserStateProvider>
              </RatesStateProvider>
            </IntlStateProvider>
          </AppStateProvider>
        </ThemeProvider>
      </DIProvider>
    </CacheProvider>
  );
};

export default CustomNextApp;
