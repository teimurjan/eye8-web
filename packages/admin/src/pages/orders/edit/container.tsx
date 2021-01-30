import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminOrdersEditPresenter } from '@eye8/admin/pages/orders/edit/presenter';
import { AdminOrdersEditView } from '@eye8/admin/pages/orders/edit/view';
import { useDI } from '@eye8/di';

import { useAdminOrdersState } from '../../../state';

export const AdminOrdersEditContainer = () => {
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
