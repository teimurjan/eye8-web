import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { Route } from 'react-router-dom';

import { AdminBannersCreateContainer } from 'src/components/Admin/Banners/Create/AdminBannersCreateContainer';
import { AdminBannersDeleteContainer } from 'src/components/Admin/Banners/Delete/AdminBannersDeleteContainer';
import { AdminBannersEditContainer } from 'src/components/Admin/Banners/Edit/AdminBannersEditContainer';
import { AdminBannersListContainer } from 'src/components/Admin/Banners/List/AdminBannersListContainer';

export const AdminBanners = ({ match }: RouteComponentProps) => (
  <>
    <AdminBannersListContainer />

    <Route path={`${match.path}/new`} component={AdminBannersCreateContainer} />
    <Route path={`${match.path}/delete/:id`} component={AdminBannersDeleteContainer} />
    <Route path={`${match.path}/edit/:id`} component={AdminBannersEditContainer} />
  </>
);
