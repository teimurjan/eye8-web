import React from 'react';

import { AdminCategoriesListPresenter } from '@eye8/admin/pages/categories/list/presenter';
import { AdminCategoriesListView } from '@eye8/admin/pages/categories/list/view';

import { useAdminCategoriesState } from '../../../state';

export const AdminCategoriesListContainer = () => {
  const adminCategoriesState = useAdminCategoriesState();

  return <AdminCategoriesListPresenter View={AdminCategoriesListView} adminCategoriesState={adminCategoriesState} />;
};
