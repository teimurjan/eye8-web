import React from 'react';

import { AdminCategoriesState } from '../../../state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  adminCategoriesState: AdminCategoriesState;
}

export interface ViewProps {
  categories: AdminCategoriesState['entities'];
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
