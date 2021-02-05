import React from 'react';

import { useAdminProductTypesState } from '../../../state';

import AdminProductTypesListPresenter from './presenter';
import AdminProductTypesListView from './view';


const AdminProductTypesListContainer = () => {
  const adminProductTypesState = useAdminProductTypesState();

  return (
    <AdminProductTypesListPresenter View={AdminProductTypesListView} adminProductTypesState={adminProductTypesState} />
  );
};

export default AdminProductTypesListContainer;
