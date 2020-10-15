import * as React from 'react';
import { injectIntl } from 'react-intl';

import { AdminOrdersListPresenter } from 'src/components/Admin/Orders/List/AdminOrdersListPresenter';
import { AdminOrdersListView } from 'src/components/Admin/Orders/List/AdminOrdersListView';
import { useAdminOrdersState } from 'src/state/Admin/AdminOrdersState';

const View = injectIntl(AdminOrdersListView);

export const AdminOrdersListContainer = () => {
  const { state: adminOrdersState } = useAdminOrdersState();

  return <AdminOrdersListPresenter View={View} adminOrdersState={adminOrdersState} />;
};
