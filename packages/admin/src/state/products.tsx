import React from 'react';

import { Product, PaginationMeta } from '@eye8/api';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<
  Product,
  Product,
  PaginationMeta,
  { page: number; productTypeId?: number; available?: boolean; deleted?: boolean }
>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminProductsStateProvider = makeEntityState(
  Context,
  (d, params = { page: 1 }) => {
    if (params.productTypeId) {
      return d.di.service.product.getForProductType(params.productTypeId, { available: params.available });
    }

    return d.di.service.product.getAll(params);
  },
  'products',
);

export const useAdminProductsState = () => React.useContext(Context) as ContextValue;
