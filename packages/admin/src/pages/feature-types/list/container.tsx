import React from 'react';

import { useAdminFeatureTypesState } from '../../../state';

import AdminFeatureTypesListPresenter from './presenter';
import AdminFeatureTypesListView from './view';


const AdminFeatureTypesListContainer = () => {
  const adminFeatureTypesState = useAdminFeatureTypesState();

  return (
    <AdminFeatureTypesListPresenter View={AdminFeatureTypesListView} adminFeatureTypesState={adminFeatureTypesState} />
  );
};

export default AdminFeatureTypesListContainer;
