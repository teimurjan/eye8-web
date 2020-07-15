import * as React from 'react';

import { useDependencies } from 'src/DI/DI';
import { IGroupedRates } from 'src/services/RateService';

export interface IContextValue {
  ratesState: {
    rates: IGroupedRates;
    isLoading: boolean;
    error?: string;
    fetchRates: (date?: string) => Promise<void>;
  };
}

const Context = React.createContext<IContextValue | null>(null);

export interface IProviderProps {
  children: React.ReactNode;
  initialProps?: {
    rates: IGroupedRates;
    error?: string;
  };
}

export const RatesStateProvider: React.SFC<IProviderProps> = ({ initialProps, children }) => {
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
    return rateService.addChangeListener((_, rates) => setRates(rates as IGroupedRates));
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

export const useRatesState = () => React.useContext(Context) as IContextValue;
