import * as React from 'react';

import { AdminProductTypesListPresenter } from 'src/components/admin/pages/ProductTypes/List/AdminProductTypesListPresenter';
import { AdminProductTypesListView } from 'src/components/admin/pages/ProductTypes/List/AdminProductTypesListView';
import { useAdminProductTypesState } from 'src/state/Admin/AdminProductTypesState';

export const AdminProductTypesListContainer = () => {
  const { state: adminProductTypesState } = useAdminProductTypesState();

  return (
    <AdminProductTypesListPresenter View={AdminProductTypesListView} adminProductTypesState={adminProductTypesState} />
  );
};
