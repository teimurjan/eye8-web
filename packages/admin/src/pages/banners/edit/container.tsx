import React from 'react';
import { useHistory, useParams } from 'react-router';

import { useAdminBannersState } from '@eye8/admin/state';
import { useDI } from '@eye8/di';

import AdminBannersEditPresenter from './presenter';
import AdminBannersEditView from './view';

const AdminBannersEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { di } = useDI();
  const adminBannersState = useAdminBannersState();

  return (
    <AdminBannersEditPresenter
      bannerId={parseInt(params.id, 10)}
      history={history}
      View={AdminBannersEditView}
      service={di.service.banner}
      adminBannersState={adminBannersState}
    />
  );
};

export default AdminBannersEditContainer;
