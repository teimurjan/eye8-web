import * as React from 'react';

import { AdminFeatureTypesListPresenter } from 'src/components/Admin/FeatureTypes/List/AdminFeatureTypesListPresenter';
import { AdminFeatureTypesListView } from 'src/components/Admin/FeatureTypes/List/AdminFeatureTypesListView';
import { useAdminFeatureTypesState } from 'src/state/Admin/AdminFeatureTypesState';

export const AdminFeatureTypesListContainer = () => {
  const { state: adminFeatureTypesState } = useAdminFeatureTypesState();

  return (
    <AdminFeatureTypesListPresenter View={AdminFeatureTypesListView} adminFeatureTypesState={adminFeatureTypesState} />
  );
};
