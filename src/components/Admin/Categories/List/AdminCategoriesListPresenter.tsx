import * as React from 'react';

import { useDebounce } from 'src/hooks/useDebounce';
import { IContextValue as AdminCategoriesContextValue } from 'src/state/AdminCategoriesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  categories: AdminCategoriesContextValue['adminCategoriesState']['categories'];
  isDataLoaded: boolean;
  isLoading: boolean;
  locales: string[];
}

export const AdminCategoriesListPresenter = ({
  View,
  adminCategoriesState: { isListLoading, categories, getCategories, hasListLoaded },
  intlState: { availableLocales },
}: IProps & AdminCategoriesContextValue & IntlStateContextValue) => {
  const isLoadingDebounced = useDebounce(isListLoading, 1000);

  React.useEffect(() => {
    getCategories();
  }, [getCategories]);

  return (
    <View
      isDataLoaded={hasListLoaded}
      isLoading={isLoadingDebounced}
      locales={availableLocales.map(({ name }) => name)}
      categories={categories}
    />
  );
};
