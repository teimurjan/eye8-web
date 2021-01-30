import React from 'react';

import { AdminProductTypesListPresenter } from '@eye8/admin/pages/product-types/list/presenter';
import { AdminProductTypesListView } from '@eye8/admin/pages/product-types/list/view';

import { useAdminProductTypesState } from '../../../state';

export const AdminProductTypesListContainer = () => {
  const adminProductTypesState = useAdminProductTypesState();

  return (
    <AdminProductTypesListPresenter View={AdminProductTypesListView} adminProductTypesState={adminProductTypesState} />
  );
};
