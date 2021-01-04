import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminCategoriesEditPresenter } from '@eye8/admin/pages/categories/edit/presenter';
import { AdminCategoriesEditView } from '@eye8/admin/pages/categories/edit/view';
import { useAdminCategoriesState } from '@eye8/admin/state/categories';
import { useDependencies } from '@eye8/di';

export const AdminCategoriesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { state: adminCategoriesState } = useAdminCategoriesState();

  return (
    <AdminCategoriesEditPresenter
      categoryId={parseInt(params.id, 10)}
      history={history}
      View={AdminCategoriesEditView}
      service={dependencies.services.category}
      adminCategoriesState={adminCategoriesState}
    />
  );
};
