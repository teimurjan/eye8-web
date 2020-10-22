import * as React from 'react';

import { AdminCategoriesListPresenter } from 'src/components/admin/pages/Categories/List/AdminCategoriesListPresenter';
import { AdminCategoriesListView } from 'src/components/admin/pages/Categories/List/AdminCategoriesListView';
import { useAdminCategoriesState } from 'src/state/Admin/AdminCategoriesState';

export const AdminCategoriesListContainer = () => {
  const { state: adminCategoriesState } = useAdminCategoriesState();

  return <AdminCategoriesListPresenter View={AdminCategoriesListView} adminCategoriesState={adminCategoriesState} />;
};