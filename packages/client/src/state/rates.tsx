import React from 'react';

import { useDependencies } from '@eye8/di';
import { GroupedRates } from '@eye8/service/rate';

export interface ContextValue {
  ratesState: {
    rates: GroupedRates;
    isLoading: boolean;
    error?: string;
    fetchRates: (date?: string) => Promise<void>;
  };
}

const Context = React.createContext<ContextValue | null>(null);

export interface ProviderProps {
  children: React.ReactNode;
  initialProps?: {
    rates: GroupedRates;
    error?: string;
  };
}

export const RatesStateProvider: React.SFC<ProviderProps> = ({ initialProps, children }) => {
  const {
    dependencies: {
      services: { rate: rateService },
    },
  } = useDependencies();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(initialProps ? initialProps.error : undefined);
  const [rates, setRates] = React.useState(initialProps ? initialProps.rates : rateService.getAllCached());

  const fetchRates = async () => {
    setLoading(true);
    try {
      setRates(await rateService.getAllGrouped());
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    return rateService.addChangeListener((_, rates) => setRates(rates as GroupedRates));
  }, [rateService]);

  return (
    <Context.Provider
      value={{
        ratesState: {
          rates,
          isLoading,
          error,
          fetchRates,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useRatesState = () => React.useContext(Context) as ContextValue;
