import React from 'react';

import { AdminBannersListPresenter } from '@eye8/admin/pages/banners/list/presenter';
import { AdminBannersListView } from '@eye8/admin/pages/banners/list/view';
import { useAdminBannersState } from '@eye8/admin/state';

export const AdminBannersListContainer = () => {
  const adminBannersState = useAdminBannersState();

  return <AdminBannersListPresenter View={AdminBannersListView} adminBannersState={adminBannersState} />;
};
