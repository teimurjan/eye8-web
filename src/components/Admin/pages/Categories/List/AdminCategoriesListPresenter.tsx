import * as React from 'react';

import { ContextValue as AdminCategoriesStateContextValue } from 'src/state/Admin/AdminCategoriesState';

export interface IProps {
  View: React.ComponentType<IViewProps>;
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
