import * as React from 'react';

import { IRateListResponseItem } from 'src/api/RateAPI';
import { makeEntityState, IContextValue } from 'src/state/makeEntityState';

export type ContextValue = IContextValue<IRateListResponseItem, IRateListResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminRatesStateProvider = makeEntityState(Context, (d) => d.dependencies.services.rate.getAll(), 'rates');

export const useAdminRatesState = () => React.useContext(Context) as ContextValue;
