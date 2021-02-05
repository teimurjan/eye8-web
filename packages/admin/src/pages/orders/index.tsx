import React from 'react';

import { Page } from '../../components';

import AdminOrdersDelete from './delete';
import AdminOrdersEdit from './edit';
import AdminOrdersList from './list';

const AdminOrders = () => (
  <Page
    ListComponent={AdminOrdersList}
    CreateComponent={() => null}
    EditComponent={AdminOrdersEdit}
    DeleteComponent={AdminOrdersDelete}
  />
);

export default AdminOrders;
