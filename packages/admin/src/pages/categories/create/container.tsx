import React from 'react';
import { useHistory } from 'react-router';

import { AdminCategoriesCreatePresenter } from '@eye8/admin/pages/categories/create/presenter';
import { AdminCategoriesCreateView } from '@eye8/admin/pages/categories/create/view';
import { useAdminCategoriesState } from '@eye8/admin/state';
import { useDI } from '@eye8/di';

export const AdminCategoriesCreateContainer = () => {
  const history = useHistory();

  const { di } = useDI();
  const adminCategoriesState = useAdminCategoriesState();

  return (
    <AdminCategoriesCreatePresenter
      history={history}
      View={AdminCategoriesCreateView}
      service={di.service.category}
      adminCategoriesState={adminCategoriesState}
    />
  );
};
