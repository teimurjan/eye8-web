import React from 'react';

import { AdminOrdersListPresenter } from '@eye8/admin/pages/orders/list/presenter';
import { AdminOrdersListView } from '@eye8/admin/pages/orders/list/view';

import { useAdminOrdersState } from '../../../state';

export const AdminOrdersListContainer = () => {
  const adminOrdersState = useAdminOrdersState();

  return <AdminOrdersListPresenter View={AdminOrdersListView} adminOrdersState={adminOrdersState} />;
};
