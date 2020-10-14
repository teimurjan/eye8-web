import * as React from 'react';

import { ContextValue as AdminCategoriesStateContextValue } from 'src/state/AdminCategoriesState';

export interface IProps {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  adminCategoriesState: AdminCategoriesStateContextValue['state'];
}

export interface IViewProps {
  categories: AdminCategoriesStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminCategoriesListPresenter = ({
  View,
  adminCategoriesState: { isListLoading, entities, get, hasListLoaded },
}: IProps) => {
  React.useEffect(() => {
    get();
  }, [get]);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} categories={entities} />;
};
