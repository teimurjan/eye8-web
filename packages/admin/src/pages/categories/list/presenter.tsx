import React from 'react';

import { ContextValue as AdminCategoriesStateContextValue } from '@eye8/admin/state/categories';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminCategoriesState: AdminCategoriesStateContextValue['state'];
}

export interface ViewProps {
  categories: AdminCategoriesStateContextValue['state']['entities'];
  isDataLoaded: boolean;
  isLoading: boolean;
}

export const AdminCategoriesListPresenter = ({
  View,
  adminCategoriesState: { isListLoading, entities, get, hasListLoaded },
}: Props) => {
  React.useEffect(() => {
    get();
  }, [get]);

  return <View isDataLoaded={hasListLoaded} isLoading={isListLoading} categories={entities} />;
};
