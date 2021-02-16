import React from 'react';

import { Order } from '@eye8/api';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<Order>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminOrdersStateProvider = makeEntityState(Context, (d) => d.di.service.order.getAll(), 'orders');

export const useAdminOrdersState = () => React.useContext(Context) as ContextValue;
