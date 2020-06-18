import * as React from 'react';

import { IPromoCodeListResponseItem } from 'src/api/PromoCodeAPI';
import { useDependencies } from 'src/DI/DI';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IContextValue {
  adminPromoCodesState: {
    promoCodes: IPromoCodeListResponseItem[];
    isListLoading: boolean;
    hasListLoaded: boolean;
    listError: undefined | string;
    getPromoCodes: () => Promise<void>;
    deletePromoCode: (id: number) => void;
    addPromoCode: (order: IPromoCodeListResponseItem) => void;
    setPromoCode: (order: IPromoCodeListResponseItem) => void;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
}

export const AdminPromoCodesStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const {
    dependencies: {
      services: { promoCode: service },
    },
  } = useDependencies();

  const [promoCodes, setPromoCodes] = React.useState<{ [key: string]: IPromoCodeListResponseItem }>({});
  const [promoCodesOrder, setPromoCodesOrder] = React.useState<number[]>([]);
  const [isListLoading, setListLoading] = React.useState(false);
  const [listError, setListError] = React.useState<undefined | string>(undefined);
  const [hasListLoaded, setListLoaded] = React.useState(false);

  const getPromoCodes = React.useCallback(async () => {
    setListLoading(true);
    try {
      const { entities, result } = await service.getAll();
      setPromoCodes(entities.promoCodes);
      setPromoCodesOrder(result);
    } catch (e) {
      setListError('errors.common');
    } finally {
      setListLoading(false);
      setListLoaded(true);
    }
  }, [service]);

  const addPromoCode = React.useCallback(
    (order: IPromoCodeListResponseItem) => {
      const newPromoCodes = {
        ...promoCodes,
        [order.id]: order,
      };

      const newPromoCodesOrder = [...promoCodesOrder, order.id];

      setPromoCodes(newPromoCodes);
      setPromoCodesOrder(newPromoCodesOrder);
    },
    [promoCodes, promoCodesOrder],
  );

  const setPromoCode = React.useCallback(
    (order: IPromoCodeListResponseItem) => {
      const newOrders = {
        ...promoCodes,
        [order.id]: order,
      };

      setPromoCodes(newOrders);
    },
    [promoCodes],
  );

  const deletePromoCode = React.useCallback(
    (id: number) => {
      const newOrders = { ...promoCodes };
      delete newOrders[id];

      const newOrdersOrder = promoCodesOrder.filter(idFromOrder => idFromOrder !== id);
      setPromoCodesOrder(newOrdersOrder);
      setPromoCodes(newOrders);
    },
    [promoCodes, promoCodesOrder],
  );

  return (
    <Context.Provider
      value={{
        adminPromoCodesState: {
          addPromoCode,
          deletePromoCode,
          promoCodes: agregateOrderedMapToArray(promoCodes, promoCodesOrder),
          getPromoCodes,
          hasListLoaded,
          isListLoading,
          listError,
          setPromoCode,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAdminPromoCodesState = () => React.useContext(Context) as IContextValue;
