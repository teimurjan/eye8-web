import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';

import { AdminProductTypesCreateContainer } from 'src/components/Admin/ProductTypes/Create/AdminProductTypesCreateContainer';
import { AdminProductTypesDeleteContainer } from 'src/components/Admin/ProductTypes/Delete/AdminProductTypesDeleteContainer';
import { AdminProductTypesEditContainer } from 'src/components/Admin/ProductTypes/Edit/AdminProductTypesEditContainer';
import { AdminProductTypesListContainer } from 'src/components/Admin/ProductTypes/List/AdminProductTypesListContainer';

export const AdminProductTypes = ({ match }: RouteComponentProps) => (
  <>
    <AdminProductTypesListContainer />

    <Route path={`${match.path}/new`} component={AdminProductTypesCreateContainer} />
    <Route path={`${match.path}/edit/:id`} component={AdminProductTypesEditContainer} />
    <Route path={`${match.path}/delete/:id`} component={AdminProductTypesDeleteContainer} />
  </>
);
