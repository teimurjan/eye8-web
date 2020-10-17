import * as React from 'react';

import { AdminFeatureValuesListPresenter } from 'src/components/Admin/FeatureValues/List/AdminFeatureValuesListPresenter';
import { AdminFeatureValuesListView } from 'src/components/Admin/FeatureValues/List/AdminFeatureValuesListView';
import { useAdminFeatureValuesState } from 'src/state/Admin/AdminFeatureValuesState';

export const AdminFeatureValuesListContainer = () => {
  const { state: adminFeatureValuesState } = useAdminFeatureValuesState();

  return (
    <AdminFeatureValuesListPresenter
      View={AdminFeatureValuesListView}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
