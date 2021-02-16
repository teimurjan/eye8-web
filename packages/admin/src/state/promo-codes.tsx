import React from 'react';

import { PromoCode } from '@eye8/api';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<PromoCode, PromoCode, undefined, { deleted: boolean }>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminPromoCodesStateProvider = makeEntityState(
  Context,
  (d, params = { deleted: false }) => d.di.service.promoCode.getAll(params.deleted),
  'promoCodes',
);

export const useAdminPromoCodesState = () => React.useContext(Context) as ContextValue;
