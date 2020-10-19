import * as React from 'react';

import { IProductTypeListRawIntlResponseItem, IProductTypeListResponseMeta } from 'src/api/ProductTypeAPI';
import { makeEntityState, IContextValue } from 'src/state/makeEntityState';

export type ContextValue = IContextValue<
  IProductTypeListRawIntlResponseItem,
  IProductTypeListRawIntlResponseItem,
  IProductTypeListResponseMeta,
  { page: number; deleted?: boolean; available?: boolean }
>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminProductTypesStateProvider = makeEntityState(
  Context,
  (d, params = { page: 1 }) => d.dependencies.services.productType.getAllRawIntl(params),
  'productTypes',
);

export const useAdminProductTypesState = () => React.useContext(Context) as ContextValue;
