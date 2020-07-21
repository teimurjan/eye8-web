import * as React from 'react';

import { IIntlListResponseItem } from 'src/api/IntlAPI';
import { IProductTypeListRawIntlResponseItem, IProductTypeListResponseMeta } from 'src/api/ProductTypeAPI';
import { extendIntlTextWithLocaleNames } from 'src/helpers/intl';
import { makeEntityState, IContextValue } from 'src/state/makeEntityState';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export const agregateProductTypesForState = (
  productTypes: { [key: string]: IProductTypeListRawIntlResponseItem },
  productTypesOrder: number[],
  availableLocales: IIntlListResponseItem[],
) =>
  agregateOrderedMapToArray(productTypes, productTypesOrder, productType => ({
    ...productType,
    name: extendIntlTextWithLocaleNames(productType.name, availableLocales),
    description: extendIntlTextWithLocaleNames(productType.description, availableLocales),
    short_description: extendIntlTextWithLocaleNames(productType.short_description, availableLocales),
  }));

export type ContextValue = IContextValue<
  IProductTypeListRawIntlResponseItem,
  IProductTypeListRawIntlResponseItem,
  IProductTypeListResponseMeta,
  { page: number }
>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminProductTypesStateProvider = makeEntityState(
  Context,
  (d, params = { page: 1 }) => d.dependencies.services.productType.getAllRawIntl(params.page),
  'productTypes',
);

export const useAdminProductTypesState = () => React.useContext(Context) as ContextValue;
