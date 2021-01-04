import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminOrdersEditPresenter } from '@eye8/admin/pages/orders/edit/presenter';
import { AdminOrdersEditView } from '@eye8/admin/pages/orders/edit/view';
import { useAdminOrdersState } from '@eye8/admin/state/orders';
import { useDependencies } from '@eye8/di';

export const AdminOrdersEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { state: adminOrdersState } = useAdminOrdersState();

  return (
    <AdminOrdersEditPresenter
      orderId={parseInt(params.id, 10)}
      history={history}
      View={AdminOrdersEditView}
      service={dependencies.services.order}
      adminOrdersState={adminOrdersState}
    />
  );
};
