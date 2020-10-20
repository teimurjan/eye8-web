import * as React from 'react';

import { IProductTypeListRawIntlResponseItem, IProductTypeListResponseMeta } from 'src/api/ProductTypeAPI';
import { makeEntityState, IContextValue } from 'src/state/makeEntityState';

export type ContextValue = IContextValue<
  IProductTypeListRawIntlResponseItem,
  IProductTypeListRawIntlResponseItem,
  IProductTypeListResponseMeta,
  { page: number; deleted?: boolean; available?: boolean; query?: string }
>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminProductTypesStateProvider = makeEntityState(
  Context,
  (d, params = { page: 1 }) => {
    const { productType: productTypeService } = d.dependencies.services;
    if (params.query) {
      return productTypeService.searchRawIntl(params.query, {
        page: params.page,
        available: params.available,
        deleted: params.deleted,
      });
    }

    return productTypeService.getAllRawIntl(params);
  },
  'productTypes',
);

export const useAdminProductTypesState = () => React.useContext(Context) as ContextValue;
