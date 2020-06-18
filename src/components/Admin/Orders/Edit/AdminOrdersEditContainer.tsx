import * as React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminOrdersEditPresenter } from 'src/components/Admin/Orders/Edit/AdminOrdersEditPresenter';
import { AdminOrdersEditView } from 'src/components/Admin/Orders/Edit/AdminOrdersEditView';
import { useDependencies } from 'src/DI/DI';
import { useAdminOrdersState } from 'src/state/AdminOrdersState';

export const AdminOrdersEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { adminOrdersState } = useAdminOrdersState();

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
