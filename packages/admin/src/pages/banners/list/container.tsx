import React from 'react';

import { useAdminBannersState } from '@eye8/admin/state';

import AdminBannersListPresenter from './presenter';
import AdminBannersListView from './view';

const AdminBannersListContainer = () => {
  const adminBannersState = useAdminBannersState();

  return <AdminBannersListPresenter View={AdminBannersListView} adminBannersState={adminBannersState} />;
};

export default AdminBannersListContainer;
