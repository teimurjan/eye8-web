import React from 'react';

import { ICategoryListRawIntlResponseItem } from '@eye8/api/category';
import { makeEntityState, IContextValue } from '@eye8/shared/utils';

export type ContextValue = IContextValue<ICategoryListRawIntlResponseItem, ICategoryListRawIntlResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminCategoriesStateProvider = makeEntityState(
  Context,
  (d) => d.dependencies.services.category.getAllRawIntl(),
  'categories',
);

export const useAdminCategoriesState = () => React.useContext(Context) as ContextValue;
