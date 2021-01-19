import React from 'react';
import { useHistory } from 'react-router';

import { AdminBannersCreatePresenter } from '@eye8/admin/pages/banners/create/presenter';
import { AdminBannersCreateView } from '@eye8/admin/pages/banners/create/view';
import { useAdminBannersState } from '@eye8/admin/state/banners';
import { useDI } from '@eye8/di';

export const AdminBannersCreateContainer = () => {
  const history = useHistory();

  const { di } = useDI();
  const { state: adminBannersState } = useAdminBannersState();

  return (
    <AdminBannersCreatePresenter
      history={history}
      View={AdminBannersCreateView}
      service={di.service.banner}
      adminBannersState={adminBannersState}
    />
  );
};
