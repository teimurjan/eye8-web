import React from 'react';

import { CategoryListRawIntlResponseItem } from '@eye8/api/category';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<CategoryListRawIntlResponseItem, CategoryListRawIntlResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminCategoriesStateProvider = makeEntityState(
  Context,
  (d) => d.di.service.category.getAllRawIntl(),
  'categories',
);

export const useAdminCategoriesState = () => React.useContext(Context) as ContextValue;
