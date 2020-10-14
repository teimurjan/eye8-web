import * as React from 'react';

import { ICategoryListRawIntlResponseItem } from 'src/api/CategoryAPI';
import { makeEntityState, IContextValue } from 'src/state/makeEntityState';

export type ContextValue = IContextValue<ICategoryListRawIntlResponseItem, ICategoryListRawIntlResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminCategoriesStateProvider = makeEntityState(
  Context,
  (d) => d.dependencies.services.category.getAllRawIntl(),
  'categories',
);

export const useAdminCategoriesState = () => React.useContext(Context) as ContextValue;
