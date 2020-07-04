import { CacheProvider, ClassNames } from '@emotion/core';
import * as Sentry from '@sentry/browser';
import { cache } from 'emotion';
import { ThemeProvider } from 'emotion-theming';
import { AppProps, AppContext } from 'next/app';
import * as React from 'react';
import { createIntl, createIntlCache } from 'react-intl';

import { CustomHead } from 'src/_app/CustomHead';
import { EntryPoint } from 'src/_app/EntryPoint';
import { GlobalStyles } from 'src/_app/GlobalStyle';
import { LoadingOverlay } from 'src/_app/LoadingOverlay';
import { SentryErrorBoundary } from 'src/_app/SentryErrorBoundary';
import { CacheBuster } from 'src/components/CacheBuster';
import { Modal } from 'src/components/client-ui/Modal/Modal';
import { PageProgressBar } from 'src/components/common-ui/PageProgressBar/PageProgressBar';
import { LoginContainer } from 'src/components/Login/LoginContainer';
import { SignUpContainer } from 'src/components/SignUp/SignUpContainer';
import { MessageToast } from 'src/components/Toast/MessageToast';
import { ToastContainer } from 'src/components/Toast/ToastContainer';
import { dependenciesFactory, IDependenciesFactoryArgs } from 'src/DI/DependenciesContainer';
import { DIProvider } from 'src/DI/DI';
import { useLazyInitialization } from 'src/hooks/useLazyInitialization';
import { AppStateProvider } from 'src/state/AppState';
import { AuthModalStateProvider, useAuthModalState } from 'src/state/AuthModalState';
import { CategoriesStateProvider } from 'src/state/CategoriesState';
import { IntlStateProvider } from 'src/state/IntlState';
import { RatesStateProvider } from 'src/state/RatesState';
import { UserStateProvider } from 'src/state/UserState';
import { mediaQueries } from 'src/styles/media';
import { defaultTheme } from 'src/themes';

import 'bulma/css/bulma.css';

const intlCache = createIntlCache();
const dependencies = dependenciesFactory();

Sentry.init({ dsn: process.env.SENTRY_DSN });

const Toaster = () => (
  <ClassNames>
    {({ css: css_ }) => (
      <ToastContainer
        className={css_`
          position: fixed;
          top: 0;
          right: 0;
          padding: 10px 20px;
          z-index: 200;

          @media ${mediaQueries.maxWidth768} {
            width: 100%;
            padding: 10px;
          }
        `}
        Component={MessageToast}
      />
    )}
  </ClassNames>
);

const AuthModal = () => {
  const { authModalState } = useAuthModalState();

  const isLoginOpen = authModalState.modalType === 'login';
  const isSignUpOpen = authModalState.modalType === 'signup';
  const { value: isOpen } = useLazyInitialization(isLoginOpen || isSignUpOpen, false);

  const children = React.useMemo(() => {
    if (isLoginOpen) {
      return <LoginContainer />;
    }
    if (isSignUpOpen) {
      return <SignUpContainer />;
    }
  }, [isLoginOpen, isSignUpOpen]);

  return (
    <Modal isOpen={isOpen} close={authModalState.close} fixed backdrop debounceChildrenOnClose>
      {children}
    </Modal>
  );
};

const CustomNextApp = ({
  Component,
  pageProps,
  locale,
  messages,
  componentsInitialProps,
}: AppProps & Then<ReturnType<typeof getInitialProps>>) => {
  const intl = createIntl(
    {
      locale,
      messages,
    },
    intlCache,
  );

  return (
    <SentryErrorBoundary>
      <CacheProvider value={cache}>
        <DIProvider value={{ dependencies }}>
          <>
            <ThemeProvider theme={defaultTheme}>
              <AppStateProvider>
                <IntlStateProvider
                  initialProps={{
                    availableLocales: componentsInitialProps.intlState.availableLocales,
                    error: componentsInitialProps.intlState.error,
                  }}
                  intl={intl}
                >
                  <RatesStateProvider initialProps={componentsInitialProps.ratesState}>
                    <UserStateProvider>
                      <CategoriesStateProvider initialProps={componentsInitialProps.categoriesState}>
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
                            </>
                          </EntryPoint>
                        </AuthModalStateProvider>
                      </CategoriesStateProvider>
                    </UserStateProvider>
                  </RatesStateProvider>
                </IntlStateProvider>
              </AppStateProvider>
            </ThemeProvider>
            <CacheBuster />
          </>
        </DIProvider>
      </CacheProvider>
    </SentryErrorBoundary>
  );
};

const getComponentsInitialProps = async (args: IDependenciesFactoryArgs) => {
  const {
    services: { category: categoryService, intl: intlService, rate: rateService },
  } = dependenciesFactory(args);
  try {
    const { entities, result } = await categoryService.getAll();
    const availableLocales = await intlService.getAvailableLocales();
    const rates = await rateService.getAllGrouped();
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

const getInitialProps = async ({ Component, ctx }: AppContext) => {
  const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {};

  const { req, res } = ctx;
  const { locale, messages } = req || (window as any).__NEXT_DATA__.props;

  return {
    pageProps,
    locale,
    messages,
    componentsInitialProps: await getComponentsInitialProps({ req, res }),
  };
};

CustomNextApp.getInitialProps = getInitialProps;

export default CustomNextApp;
