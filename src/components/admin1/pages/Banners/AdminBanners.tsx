import * as React from 'react';

import { AdminPage } from 'src/components/admin/pages/AdminPage';
import { AdminBannersCreateContainer } from 'src/components/admin/pages/Banners/Create/AdminBannersCreateContainer';
import { AdminBannersDeleteContainer } from 'src/components/admin/pages/Banners/Delete/AdminBannersDeleteContainer';
import { AdminBannersEditContainer } from 'src/components/admin/pages/Banners/Edit/AdminBannersEditContainer';
import { AdminBannersListContainer } from 'src/components/admin/pages/Banners/List/AdminBannersListContainer';

export const AdminBanners = () => (
  <AdminPage
    ListComponent={AdminBannersListContainer}
    CreateComponent={AdminBannersCreateContainer}
    EditComponent={AdminBannersEditContainer}
    DeleteComponent={AdminBannersDeleteContainer}
  />
);
