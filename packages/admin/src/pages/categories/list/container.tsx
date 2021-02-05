import React from 'react';

import { useAdminCategoriesState } from '../../../state';

import AdminCategoriesListPresenter from './presenter';
import AdminCategoriesListView from './view';

const AdminCategoriesListContainer = () => {
  const adminCategoriesState = useAdminCategoriesState();

  return <AdminCategoriesListPresenter View={AdminCategoriesListView} adminCategoriesState={adminCategoriesState} />;
};

export default AdminCategoriesListContainer;
