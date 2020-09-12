import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';

import { AdminProductsCreateContainer } from 'src/components/Admin/Products/Create/AdminProductsCreateContainer';
import { AdminProductsDeleteContainer } from 'src/components/Admin/Products/Delete/AdminProductsDeleteContainer';
import { AdminProductsEditContainer } from 'src/components/Admin/Products/Edit/AdminProductsEditContainer';
import { AdminProductsListContainer } from 'src/components/Admin/Products/List/AdminProductsListContainer';
import { AdminProductsFiltersStateProvider } from 'src/state/AdminProductsFiltersState';

export const AdminProducts = ({ match }: RouteComponentProps) => {
  return (
    <AdminProductsFiltersStateProvider>
      <AdminProductsListContainer />
      <Route path={`${match.path}/new`} component={AdminProductsCreateContainer} />
      <Route path={`${match.path}/edit/:id`} component={AdminProductsEditContainer} />
      <Route path={`${match.path}/delete/:id`} component={AdminProductsDeleteContainer} />
    </AdminProductsFiltersStateProvider>
  );
};
