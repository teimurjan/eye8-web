import React from 'react';

import { AdminPage } from '@eye8/admin/components/page';
import { AdminOrdersDeleteContainer } from '@eye8/admin/pages/orders/delete/container';
import { AdminOrdersEditContainer } from '@eye8/admin/pages/orders/edit/container';
import { AdminOrdersListContainer } from '@eye8/admin/pages/orders/list/container';

export const AdminOrders = () => (
  <AdminPage
    ListComponent={AdminOrdersListContainer}
    CreateComponent={() => null}
    EditComponent={AdminOrdersEditContainer}
    DeleteComponent={AdminOrdersDeleteContainer}
  />
);
