import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminBannersEditPresenter } from '@eye8/admin/pages/banners/edit/presenter';
import { AdminBannersEditView } from '@eye8/admin/pages/banners/edit/view';
import { useAdminBannersState } from '@eye8/admin/state/banners';
import { useDependencies } from '@eye8/di';

export const AdminBannersEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { state: adminBannersState } = useAdminBannersState();

  return (
    <AdminBannersEditPresenter
      bannerId={parseInt(params.id, 10)}
      history={history}
      View={AdminBannersEditView}
      service={dependencies.services.banner}
      adminBannersState={adminBannersState}
    />
  );
};
