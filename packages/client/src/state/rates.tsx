import React from 'react';

import { Rate } from '@eye8/api';
import { useDI } from '@eye8/di';

export interface ContextValue {
  rates: {
    [key: string]: Rate[];
  };
  isLoading: boolean;
  error?: string;
  fetchRates: (date?: string) => Promise<void>;
}

const Context = React.createContext<ContextValue | null>(null);

export interface ProviderProps {
  children: React.ReactNode;
  initialProps?: {
    rates: {
      [key: string]: Rate[];
    };
    error?: string;
  };
}

export const RatesStateProvider: React.SFC<ProviderProps> = ({ initialProps, children }) => {
  const {
    di: {
      service: { rate: rateService },
    },
  } = useDI();

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
    return rateService.addChangeListener((_, rates) =>
      setRates(
        rates as {
          [key: string]: Rate[];
        },
      ),
    );
  }, [rateService]);

  return (
    <Context.Provider
      value={{
        rates,
        isLoading,
        error,
        fetchRates,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useRatesState = () => React.useContext(Context) as ContextValue;
