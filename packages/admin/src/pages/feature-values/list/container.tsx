import React from 'react';

import { useAdminFeatureValuesState } from '../../../state';

import AdminFeatureValuesListPresenter from './presenter';
import AdminFeatureValuesListView from './view';

const AdminFeatureValuesListContainer = () => {
  const adminFeatureValuesState = useAdminFeatureValuesState();

  return (
    <AdminFeatureValuesListPresenter
      View={AdminFeatureValuesListView}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};

export default AdminFeatureValuesListContainer;
