import * as React from 'react';

import { IOrderListResponseItem } from 'src/api/OrderAPI';
import { useDependencies } from 'src/DI/DI';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IContextValue {
  adminOrdersState: {
    orders: IOrderListResponseItem[];
    isListLoading: boolean;
    hasListLoaded: boolean;
    listError: undefined | string;
    getOrders: () => Promise<void>;
    deleteOrder: (id: number) => void;
    addOrder: (order: IOrderListResponseItem) => void;
    setOrder: (order: IOrderListResponseItem) => void;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
}

export const AdminOrdersStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const {
    dependencies: {
      services: { order: service },
    },
  } = useDependencies();

  const [orders, setOrders] = React.useState<{ [key: string]: IOrderListResponseItem }>({});
  const [ordersOrder, setOrdersOrder] = React.useState<number[]>([]);
  const [isListLoading, setListLoading] = React.useState(false);
  const [listError, setListError] = React.useState<undefined | string>(undefined);
  const [hasListLoaded, setListLoaded] = React.useState(false);

  const getOrders = React.useCallback(async () => {
    setListLoading(true);
    try {
      const { entities, result } = await service.getAll();
      setOrders(entities.orders);
      setOrdersOrder(result);
    } catch (e) {
      setListError('errors.common');
    } finally {
      setListLoading(false);
      setListLoaded(true);
    }
  }, [service]);

  const addOrder = React.useCallback(
    (order: IOrderListResponseItem) => {
      const newOrders = {
        ...orders,
        [order.id]: order,
      };

      const newOrdersOrder = [...ordersOrder, order.id];

      setOrders(newOrders);
      setOrdersOrder(newOrdersOrder);
    },
    [orders, ordersOrder],
  );

  const setOrder = React.useCallback(
    (order: IOrderListResponseItem) => {
      const newOrders = {
        ...orders,
        [order.id]: order,
      };

      setOrders(newOrders);
    },
    [orders],
  );

  const deleteOrder = React.useCallback(
    (id: number) => {
      const newOrders = { ...orders };
      delete newOrders[id];

      const newOrdersOrder = ordersOrder.filter(idFromOrder => idFromOrder !== id);
      setOrdersOrder(newOrdersOrder);
      setOrders(newOrders);
    },
    [orders, ordersOrder],
  );

  return (
    <Context.Provider
      value={{
        adminOrdersState: {
          addOrder,
          deleteOrder,
          orders: agregateOrderedMapToArray(orders, ordersOrder),
          getOrders,
          hasListLoaded,
          isListLoading,
          listError,
          setOrder,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAdminOrdersState = () => React.useContext(Context) as IContextValue;
