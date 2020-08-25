import * as React from 'react';

import { IOrderListResponseItem } from 'src/api/OrderAPI';
import { makeEntityState, IContextValue } from 'src/state/makeEntityState';

export type ContextValue = IContextValue<IOrderListResponseItem, IOrderListResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminOrdersStateProvider = makeEntityState(
  Context,
  (d) => d.dependencies.services.order.getAll(),
  'orders',
);

export const useAdminOrdersState = () => React.useContext(Context) as ContextValue;
