import React from 'react';

import { IOrderListResponseItem } from '@eye8/api/order';
import { makeEntityState, IContextValue } from '@eye8/shared/utils';

export type ContextValue = IContextValue<IOrderListResponseItem, IOrderListResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminOrdersStateProvider = makeEntityState(
  Context,
  (d) => d.dependencies.services.order.getAll(),
  'orders',
);

export const useAdminOrdersState = () => React.useContext(Context) as ContextValue;
