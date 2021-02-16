import React from 'react';

import { Category } from '@eye8/api';
import { makeEntityState, EntityContextValue } from '@eye8/shared/utils';

export type ContextValue = EntityContextValue<Category<true>>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminCategoriesStateProvider = makeEntityState(
  Context,
  (d) => d.di.service.category.getAllRawIntl(),
  'categories',
);

export const useAdminCategoriesState = () => React.useContext(Context) as ContextValue;
