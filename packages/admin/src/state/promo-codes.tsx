import React from 'react';

import { IPromoCodeListResponseItem } from '@eye8/api/promo-code';
import { makeEntityState, IContextValue } from '@eye8/shared/utils';

export type ContextValue = IContextValue<
  IPromoCodeListResponseItem,
  IPromoCodeListResponseItem,
  undefined,
  { deleted: boolean }
>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminPromoCodesStateProvider = makeEntityState(
  Context,
  (d, params = { deleted: false }) => d.dependencies.services.promoCode.getAll(params.deleted),
  'promoCodes',
);

export const useAdminPromoCodesState = () => React.useContext(Context) as ContextValue;
