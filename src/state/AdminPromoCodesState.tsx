import * as React from 'react';

import { IPromoCodeListResponseItem } from 'src/api/PromoCodeAPI';
import { makeEntityState, IContextValue } from 'src/state/makeEntityState';

export type ContextValue = IContextValue<IPromoCodeListResponseItem, IPromoCodeListResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminPromoCodesStateProvider = makeEntityState(
  Context,
  d => d.dependencies.services.promoCode.getAll(),
  'promoCodes',
);

export const useAdminPromoCodesState = () => React.useContext(Context) as ContextValue;
