import React from 'react';

import { AdminFeatureValuesListPresenter } from '@eye8/admin/pages/feature-values/list/presenter';
import { AdminFeatureValuesListView } from '@eye8/admin/pages/feature-values/list/view';
import { useAdminFeatureValuesState } from '@eye8/admin/state/feature-values';

export const AdminFeatureValuesListContainer = () => {
  const { state: adminFeatureValuesState } = useAdminFeatureValuesState();

  return (
    <AdminFeatureValuesListPresenter
      View={AdminFeatureValuesListView}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
