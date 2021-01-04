import React from 'react';

import { ContextValue as AdminOrdersStateContextValue } from '@eye8/admin/state/orders';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  adminOrdersState: AdminOrdersStateContextValue['state'];
}

export interface IViewProps {
  orders: AdminOrdersStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminOrdersListPresenter = ({
  View,
  adminOrdersState: { isListLoading, entities: orders, get: getOrders, hasListLoaded },
}: IProps) => {
  React.useEffect(() => {
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} orders={orders} />;
};
