import React from 'react';

import { AdminProductTypesListPresenter } from '@eye8/admin/pages/product-types/list/presenter';
import { AdminProductTypesListView } from '@eye8/admin/pages/product-types/list/view';
import { useAdminProductTypesState } from '@eye8/admin/state/product-types';

export const AdminProductTypesListContainer = () => {
  const { state: adminProductTypesState } = useAdminProductTypesState();

  return (
    <AdminProductTypesListPresenter View={AdminProductTypesListView} adminProductTypesState={adminProductTypesState} />
  );
};
