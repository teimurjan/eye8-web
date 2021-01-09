import React from 'react';

import { ProductListResponseItem, ProductListResponseMeta } from '@eye8/api/product';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<
  ProductListResponseItem,
  ProductListResponseItem,
  ProductListResponseMeta,
  { page: number; productTypeId?: number; available?: boolean; deleted?: boolean }
>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminProductsStateProvider = makeEntityState(
  Context,
  (d, params = { page: 1 }) => {
    if (params.productTypeId) {
      return d.dependencies.services.product.getForProductType(params.productTypeId, { available: params.available });
    }

    return d.dependencies.services.product.getAll(params);
  },
  'products',
);

export const useAdminProductsState = () => React.useContext(Context) as ContextValue;
