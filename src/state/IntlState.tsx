import * as React from 'react';
import { RawIntlProvider, IntlShape } from 'react-intl';

import { IIntlListResponseItem } from 'src/api/IntlAPI.js';
import { useDependencies } from 'src/DI/DI';
import { useAppState } from 'src/state/AppState';

export interface IContextValue {
  intlState: {
    locale: string;
    availableLocales: IIntlListResponseItem[];
  };
}

const Context = React.createContext<IContextValue | null>(null);

export interface IProviderProps {
  children: React.ReactNode;
  intl: IntlShape;
  initialProps?: {
    availableLocales: IIntlListResponseItem[];
    error?: string;
  };
}

export const IntlStateProvider = ({ children, intl, initialProps }: IProviderProps) => {
  const {
    dependencies: {
      services: { intl: service },
    },
  } = useDependencies();

  const {
    appState: { setLoading, setIdle },
  } = useAppState();

  const [availableLocales, setAvailableLocales] = React.useState<IIntlListResponseItem[]>(
    initialProps ? initialProps.availableLocales : [],
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = React.useState<string | undefined>(initialProps ? initialProps.error : undefined);
  const [isInitialized, setInitialized] = React.useState(!!initialProps);

  const fetchAvailableLocales = React.useCallback(async () => {
    setLoading();
    try {
      const locales = await service.getAvailableLocales();
      setAvailableLocales(locales.map(l => ({ ...l, name: l.name.split('-')[0] })));
    } catch (e) {
      setError(e);
    } finally {
      setIdle();
    }
  }, [service, setIdle, setLoading]);

  React.useEffect(() => {
    if (isInitialized) {
      return;
    }

    fetchAvailableLocales();
    setInitialized(true);
  }, [fetchAvailableLocales, isInitialized, service]);

  return (
    <RawIntlProvider value={intl}>
      <Context.Provider value={{ intlState: { locale: intl.locale, availableLocales } }}>{children}</Context.Provider>
    </RawIntlProvider>
  );
};

export const useIntlState = () => React.useContext(Context) as IContextValue;
