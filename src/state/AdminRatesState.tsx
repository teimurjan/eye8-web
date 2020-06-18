import * as React from 'react';

import { IRateListResponseItem } from 'src/api/RateAPI';
import { useDependencies } from 'src/DI/DI';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IContextValue {
  adminRatesState: {
    rates: IRateListResponseItem[];
    isListLoading: boolean;
    hasListLoaded: boolean;
    listError: undefined | string;
    getRates: () => Promise<void>;
    addRate: (rate: IRateListResponseItem) => void;
    deleteRate: (id: number) => void;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
}

export const AdminRatesStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const {
    dependencies: {
      services: { rate: service },
    },
  } = useDependencies();

  const [rates, setRates] = React.useState<{ [key: string]: IRateListResponseItem }>({});
  const [ratesOrder, setRatesOrder] = React.useState<number[]>([]);
  const [isListLoading, setListLoading] = React.useState(false);
  const [listError, setListError] = React.useState<undefined | string>(undefined);
  const [hasListLoaded, setListLoaded] = React.useState(false);

  const getRates = React.useCallback(async () => {
    setListLoading(true);
    try {
      const { entities, result } = await service.getAll();
      setRates(entities.rates);
      setRatesOrder(result);
    } catch (e) {
      setListError('errors.common');
    } finally {
      setListLoading(false);
      setListLoaded(true);
    }
  }, [service]);

  const addRate = React.useCallback(
    (rate: IRateListResponseItem) => {
      const newRates = {
        ...rates,
        [rate.id]: rate,
      };

      const newRatesOrder = [...ratesOrder, rate.id];

      setRates(newRates);
      setRatesOrder(newRatesOrder);
    },
    [rates, ratesOrder],
  );

  const deleteRate = React.useCallback(
    (id: number) => {
      const newRates = { ...rates };
      delete newRates[id];

      const newRatesOrder = ratesOrder.filter(rateId => rateId !== id);

      setRatesOrder(newRatesOrder);
      setRates(newRates);
    },
    [rates, ratesOrder],
  );

  return (
    <Context.Provider
      value={{
        adminRatesState: {
          addRate,
          rates: agregateOrderedMapToArray(rates, ratesOrder),
          getRates,
          hasListLoaded,
          isListLoading,
          listError,
          deleteRate,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAdminRatesState = () => React.useContext(Context) as IContextValue;
