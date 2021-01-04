import React from 'react';

import { AdminFeatureTypesListPresenter } from '@eye8/admin/pages/feature-types/list/presenter';
import { AdminFeatureTypesListView } from '@eye8/admin/pages/feature-types/list/view';
import { useAdminFeatureTypesState } from '@eye8/admin/state/feature-types';

export const AdminFeatureTypesListContainer = () => {
  const { state: adminFeatureTypesState } = useAdminFeatureTypesState();

  return (
    <AdminFeatureTypesListPresenter View={AdminFeatureTypesListView} adminFeatureTypesState={adminFeatureTypesState} />
  );
};
