import React from 'react';

import { AdminFeatureTypesListPresenter } from '@eye8/admin/pages/feature-types/list/presenter';
import { AdminFeatureTypesListView } from '@eye8/admin/pages/feature-types/list/view';

import { useAdminFeatureTypesState } from '../../../state';

export const AdminFeatureTypesListContainer = () => {
  const adminFeatureTypesState = useAdminFeatureTypesState();

  return (
    <AdminFeatureTypesListPresenter View={AdminFeatureTypesListView} adminFeatureTypesState={adminFeatureTypesState} />
  );
};
