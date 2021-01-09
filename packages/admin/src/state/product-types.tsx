import React from 'react';

import { ProductTypeListRawIntlResponseItem, ProductTypeListResponseMeta } from '@eye8/api/product-type';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<
  ProductTypeListRawIntlResponseItem,
  ProductTypeListRawIntlResponseItem,
  ProductTypeListResponseMeta,
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
