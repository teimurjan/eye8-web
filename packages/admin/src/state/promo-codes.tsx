import React from 'react';

import { PromoCodeListResponseItem } from '@eye8/api/promo-code';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<
  PromoCodeListResponseItem,
  PromoCodeListResponseItem,
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
