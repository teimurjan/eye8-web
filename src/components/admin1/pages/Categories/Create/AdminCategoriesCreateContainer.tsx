import * as React from 'react';
import { useHistory } from 'react-router';

import { AdminCategoriesCreatePresenter } from 'src/components/admin/pages/Categories/Create/AdminCategoriesCreatePresenter';
import { AdminCategoriesCreateView } from 'src/components/admin/pages/Categories/Create/AdminCategoriesCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminCategoriesState } from 'src/state/Admin/AdminCategoriesState';

export const AdminCategoriesCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { state: adminCategoriesState } = useAdminCategoriesState();

  return (
    <AdminCategoriesCreatePresenter
      history={history}
      View={AdminCategoriesCreateView}
      service={dependencies.services.category}
      adminCategoriesState={adminCategoriesState}
    />
  );
};
