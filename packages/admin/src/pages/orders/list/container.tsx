import React from 'react';

import { useAdminOrdersState } from '../../../state';

import AdminOrdersListPresenter from './presenter';
import AdminOrdersListView from './view';


const AdminOrdersListContainer = () => {
  const adminOrdersState = useAdminOrdersState();

  return <AdminOrdersListPresenter View={AdminOrdersListView} adminOrdersState={adminOrdersState} />;
};

export default AdminOrdersListContainer;
