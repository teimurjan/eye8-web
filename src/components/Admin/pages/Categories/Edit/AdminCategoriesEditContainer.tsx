import * as React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminCategoriesEditPresenter } from 'src/components/admin/pages/Categories/Edit/AdminCategoriesEditPresenter';
import { AdminCategoriesEditView } from 'src/components/admin/pages/Categories/Edit/AdminCategoriesEditView';
import { useDependencies } from 'src/DI/DI';
import { useAdminCategoriesState } from 'src/state/Admin/AdminCategoriesState';

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
