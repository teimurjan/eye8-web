import React from 'react';

import { ProductType, PaginationMeta } from '@eye8/api';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<
  ProductType<true>,
  ProductType<true>,
  PaginationMeta,
  { page: number; deleted?: boolean; available?: boolean; query?: string }
>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminProductTypesStateProvider = makeEntityState(
  Context,
  (d, params = { page: 1 }) => {
    const { productType: productTypeService } = d.di.service;
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
