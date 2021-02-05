import React from 'react';
import { useHistory } from 'react-router';

import { useAdminBannersState } from '@eye8/admin/state';
import { useDI } from '@eye8/di';

import AdminBannersCreatePresenter from './presenter';
import AdminBannersCreateView from './view';

const AdminBannersCreateContainer = () => {
  const history = useHistory();

  const { di } = useDI();
  const adminBannersState = useAdminBannersState();

  return (
    <AdminBannersCreatePresenter
      history={history}
      View={AdminBannersCreateView}
      service={di.service.banner}
      adminBannersState={adminBannersState}
    />
  );
};

export default AdminBannersCreateContainer;
