import React from 'react';

import { AdminFeatureValuesListPresenter } from '@eye8/admin/pages/feature-values/list/presenter';
import { AdminFeatureValuesListView } from '@eye8/admin/pages/feature-values/list/view';

import { useAdminFeatureValuesState } from '../../../state';

export const AdminFeatureValuesListContainer = () => {
  const adminFeatureValuesState = useAdminFeatureValuesState();

  return (
    <AdminFeatureValuesListPresenter
      View={AdminFeatureValuesListView}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
