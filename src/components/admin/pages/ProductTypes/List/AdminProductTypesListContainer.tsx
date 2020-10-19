import * as React from 'react';

import { AdminProductTypesListPresenter } from 'src/components/admin/pages/ProductTypes/List/AdminProductTypesListPresenter';
import { AdminProductTypesListView } from 'src/components/admin/pages/ProductTypes/List/AdminProductTypesListView';
import { useDependencies } from 'src/DI/DI';
import { useAdminProductTypesState } from 'src/state/Admin/AdminProductTypesState';

export const AdminProductTypesListContainer = () => {
  const { state: adminProductTypesState } = useAdminProductTypesState();
  const {
    dependencies: {
      services: { search: searchService },
    },
  } = useDependencies();

  return (
    <AdminProductTypesListPresenter
      View={AdminProductTypesListView}
      adminProductTypesState={adminProductTypesState}
      searchService={searchService}
    />
  );
};
