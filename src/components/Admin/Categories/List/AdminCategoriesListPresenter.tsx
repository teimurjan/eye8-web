import * as React from 'react';

import { ContextValue as AdminCategoriesStateContextValue } from 'src/state/AdminCategoriesState';
import { IContextValue as IntlStateContextValue } from 'src/state/IntlState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminCategoriesState: AdminCategoriesStateContextValue['state'];
}

export interface IViewProps {
  categories: AdminCategoriesStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
  locales: string[];
}

export const AdminCategoriesListPresenter = ({
  View,
  adminCategoriesState: { isListLoading, entities, get, hasListLoaded },
  intlState: { availableLocales },
}: IProps & IntlStateContextValue) => {
  React.useEffect(() => {
    get();
  }, [get]);

  return (
    <View
      isDataLoaded={hasListLoaded}
      isLoading={isListLoading}
      locales={availableLocales.map(({ name }) => name)}
      categories={entities}
    />
  );
};
