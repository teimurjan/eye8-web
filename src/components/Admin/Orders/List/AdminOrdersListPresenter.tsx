import * as React from 'react';

import { useDebounce } from 'src/hooks/useDebounce';
import { IContextValue as AdminOrdersContextValue } from 'src/state/AdminOrdersState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  orders: AdminOrdersContextValue['adminOrdersState']['orders'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminOrdersListPresenter = ({
  View,
  adminOrdersState: { isListLoading, orders, getOrders, hasListLoaded },
}: IProps & AdminOrdersContextValue & IntlStateContextValue) => {
  const isLoadingDebounced = useDebounce(isListLoading, 1000);

  React.useEffect(() => {
    getOrders();
  }, [getOrders]);

  return <View isDataLoaded={hasListLoaded} isLoading={isLoadingDebounced} orders={orders} />;
};
