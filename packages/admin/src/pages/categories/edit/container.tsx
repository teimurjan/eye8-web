import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminCategoriesEditPresenter } from '@eye8/admin/pages/categories/edit/presenter';
import { AdminCategoriesEditView } from '@eye8/admin/pages/categories/edit/view';
import { useDI } from '@eye8/di';

import { useAdminCategoriesState } from '../../../state';

export const AdminCategoriesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { di } = useDI();
  const adminCategoriesState = useAdminCategoriesState();

  return (
    <AdminCategoriesEditPresenter
      categoryId={parseInt(params.id, 10)}
      history={history}
      View={AdminCategoriesEditView}
      service={di.service.category}
      adminCategoriesState={adminCategoriesState}
    />
  );
};
