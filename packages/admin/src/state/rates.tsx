import React from 'react';

import { IRateListResponseItem } from '@eye8/api/rate';
import { makeEntityState, IContextValue } from '@eye8/shared/utils';

export type ContextValue = IContextValue<IRateListResponseItem, IRateListResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminRatesStateProvider = makeEntityState(Context, (d) => d.dependencies.services.rate.getAll(), 'rates');

export const useAdminRatesState = () => React.useContext(Context) as ContextValue;
