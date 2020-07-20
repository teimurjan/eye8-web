import * as React from 'react';

import { ICategoryListRawIntlResponseItem } from 'src/api/CategoryAPI';
import { extendIntlTextWithLocaleNames } from 'src/helpers/intl';
import { makeEntityState, IContextValue } from 'src/state/AdminEntityState';

export type ContextValue = IContextValue<ICategoryListRawIntlResponseItem, undefined, ICategoryListRawIntlResponseItem>;

const Context = React.createContext<ContextValue | null>(null);

export const AdminCategoriesStateProvider = makeEntityState(
  Context,
  d => d.dependencies.services.category.getAllRawIntl(),
  'categories',
  (category, { availableLocales }) => ({
    ...category,
    text: extendIntlTextWithLocaleNames(category.name, availableLocales),
  }),
);

export const useAdminCategoriesState = () => React.useContext(Context) as ContextValue;
