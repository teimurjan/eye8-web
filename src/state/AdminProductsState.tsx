import * as React from 'react';

import { IProductListResponseItem, IProductListResponseMeta } from 'src/api/ProductAPI';
import { makeEntityState, IContextValue } from 'src/state/makeEntityState';

export type ContextValue = IContextValue<
  IProductListResponseItem,
  IProductListResponseItem,
  IProductListResponseMeta,
  { page: number }
>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminProductsStateProvider = makeEntityState(
  Context,
  (d, params = { page: 1 }) => d.dependencies.services.product.getAll(params.page),
  'products',
);

export const useAdminProductsState = () => React.useContext(Context) as ContextValue;
