import React from 'react';

import { AdminOrdersState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminOrdersState: AdminOrdersState;
}

export interface ViewProps {
  orders: AdminOrdersState['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminOrdersListPresenter = ({
  View,
  adminOrdersState: { isListLoading, entities: orders, get: getOrders, hasListLoaded },
}: Props) => {
  React.useEffect(() => {
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} orders={orders} />;
};
