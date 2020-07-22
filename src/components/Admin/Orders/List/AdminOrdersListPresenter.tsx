import * as React from 'react';

import { ContextValue as AdminOrdersStateContextValue } from 'src/state/AdminOrdersState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
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
}: IProps & IntlStateContextValue) => {
  React.useEffect(() => {
    getOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} orders={orders} />;
};
