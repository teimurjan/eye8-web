import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { AdminOrdersDeleteContainer } from 'src/components/Admin/Orders/Delete/AdminOrdersDeleteContainer';
import { AdminOrdersEditContainer } from 'src/components/Admin/Orders/Edit/AdminOrdersEditContainer';
import { AdminOrdersListContainer } from 'src/components/Admin/Orders/List/AdminOrdersListContainer';

export const AdminOrders = ({ match }: RouteComponentProps) => (
  <>
    <AdminOrdersListContainer />
    <Route path={`${match.path}/delete/:id`} component={AdminOrdersDeleteContainer} />
    <Route path={`${match.path}/edit/:id`} component={AdminOrdersEditContainer} />
  </>
);
