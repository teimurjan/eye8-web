import * as React from 'react';

import { AdminPage } from 'src/components/admin/AdminPage/AdminPage';
import { AdminOrdersDeleteContainer } from 'src/components/admin/pages/Orders/Delete/AdminOrdersDeleteContainer';
import { AdminOrdersEditContainer } from 'src/components/admin/pages/Orders/Edit/AdminOrdersEditContainer';
import { AdminOrdersListContainer } from 'src/components/admin/pages/Orders/List/AdminOrdersListContainer';

export const AdminOrders = () => (
  <AdminPage
    ListComponent={AdminOrdersListContainer}
    CreateComponent={() => null}
    EditComponent={AdminOrdersEditContainer}
    DeleteComponent={AdminOrdersDeleteContainer}
  />
);
