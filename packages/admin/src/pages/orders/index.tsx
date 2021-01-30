import React from 'react';

import { AdminOrdersDeleteContainer } from '@eye8/admin/pages/orders/delete/container';
import { AdminOrdersEditContainer } from '@eye8/admin/pages/orders/edit/container';
import { AdminOrdersListContainer } from '@eye8/admin/pages/orders/list/container';

import { Page } from '../../components';

export const AdminOrders = () => (
  <Page
    ListComponent={AdminOrdersListContainer}
    CreateComponent={() => null}
    EditComponent={AdminOrdersEditContainer}
    DeleteComponent={AdminOrdersDeleteContainer}
  />
);
