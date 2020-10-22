import * as React from 'react';

import { AdminBannersListPresenter } from 'src/components/admin/pages/Banners/List/AdminBannersListPresenter';
import { AdminBannersListView } from 'src/components/admin/pages/Banners/List/AdminBannersListView';
import { useAdminBannersState } from 'src/state/Admin/AdminBannersState';

export const AdminBannersListContainer = () => {
  const { state: adminBannersState } = useAdminBannersState();

  return <AdminBannersListPresenter View={AdminBannersListView} adminBannersState={adminBannersState} />;
};