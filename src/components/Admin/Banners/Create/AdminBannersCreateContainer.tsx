import * as React from 'react';
import { useHistory } from 'react-router';

import { AdminBannersCreatePresenter } from 'src/components/Admin/Banners/Create/AdminBannersCreatePresenter';
import { AdminBannersCreateView } from 'src/components/Admin/Banners/Create/AdminBannersCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminBannersState } from 'src/state/Admin/AdminBannersState';

export const AdminBannersCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { state: adminBannersState } = useAdminBannersState();

  return (
    <AdminBannersCreatePresenter
      history={history}
      View={AdminBannersCreateView}
      service={dependencies.services.banner}
      adminBannersState={adminBannersState}
    />
  );
};
