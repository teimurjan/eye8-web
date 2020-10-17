import * as React from 'react';

import { AdminOrdersListPresenter } from 'src/components/Admin/Orders/List/AdminOrdersListPresenter';
import { AdminOrdersListView } from 'src/components/Admin/Orders/List/AdminOrdersListView';
import { useAdminOrdersState } from 'src/state/Admin/AdminOrdersState';

export const AdminOrdersListContainer = () => {
  const { state: adminOrdersState } = useAdminOrdersState();

  return <AdminOrdersListPresenter View={AdminOrdersListView} adminOrdersState={adminOrdersState} />;
};
