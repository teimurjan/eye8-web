import React from 'react';

import { Rate } from '@eye8/api';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<Rate>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminRatesStateProvider = makeEntityState(Context, (d) => d.di.service.rate.getAll(), 'rates');

export const useAdminRatesState = () => React.useContext(Context) as ContextValue;
