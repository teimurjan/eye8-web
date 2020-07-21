import * as React from 'react';

import { IProductListResponseItem, IProductListResponseMeta } from 'src/api/ProductAPI';
import { makeEntityState, IContextValue } from 'src/state/makeEntityState';

export type ContextValue = IContextValue<
  IProductListResponseItem,
  IProductListResponseItem,
  IProductListResponseMeta,
  { page: number; productTypeId?: number }
>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminProductsStateProvider = makeEntityState(
  Context,
  (d, params = { page: 1 }) => {
    if (params.productTypeId) {
      return d.dependencies.services.product.getForProductType(params.productTypeId);
    }

    return d.dependencies.services.product.getAll(params.page);
  },
  'products',
);

export const useAdminProductsState = () => React.useContext(Context) as ContextValue;
