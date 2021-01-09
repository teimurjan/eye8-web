import React from 'react';

import { RateListResponseItem } from '@eye8/api/rate';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<RateListResponseItem, RateListResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminRatesStateProvider = makeEntityState(Context, (d) => d.dependencies.services.rate.getAll(), 'rates');

export const useAdminRatesState = () => React.useContext(Context) as ContextValue;
