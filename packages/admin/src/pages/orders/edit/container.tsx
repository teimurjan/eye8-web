import React from 'react';
import { useHistory, useParams } from 'react-router';

import { useDI } from '@eye8/di';

import { useAdminOrdersState } from '../../../state';

import AdminOrdersEditPresenter from './presenter';
import AdminOrdersEditView from './view';

const AdminOrdersEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { di } = useDI();
  const adminOrdersState = useAdminOrdersState();

  return (
    <AdminOrdersEditPresenter
      orderId={parseInt(params.id, 10)}
      history={history}
      View={AdminOrdersEditView}
      service={di.service.order}
      adminOrdersState={adminOrdersState}
    />
  );
};

export default AdminOrdersEditContainer;
