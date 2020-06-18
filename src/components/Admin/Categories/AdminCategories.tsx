import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';

import { AdminCategoriesCreateContainer } from 'src/components/Admin/Categories/Create/AdminCategoriesCreateContainer';
import { AdminCategoriesDeleteContainer } from 'src/components/Admin/Categories/Delete/AdminCategoriesDeleteContainer';
import { AdminCategoriesEditContainer } from 'src/components/Admin/Categories/Edit/AdminCategoriesEditContainer';
import { AdminCategoriesListContainer } from 'src/components/Admin/Categories/List/AdminCategoriesListContainer';

export const AdminCategories = ({ match }: RouteComponentProps) => (
  <>
    <AdminCategoriesListContainer />

    <Route path={`${match.path}/new`} component={AdminCategoriesCreateContainer} />
    <Route path={`${match.path}/delete/:id`} component={AdminCategoriesDeleteContainer} />
    <Route path={`${match.path}/edit/:id`} component={AdminCategoriesEditContainer} />
  </>
);
