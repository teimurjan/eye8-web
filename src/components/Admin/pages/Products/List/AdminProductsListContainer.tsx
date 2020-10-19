import * as React from 'react';
import { useHistory } from 'react-router';

import { AdminProductsListPresenter } from 'src/components/admin/pages/Products/List/AdminProductsListPresenter';
import { AdminProductsListView } from 'src/components/admin/pages/Products/List/AdminProductsListView';
import { useDependencies } from 'src/DI/DI';
import { useAdminProductsState } from 'src/state/Admin/AdminProductsState';

export const AdminProductsListContainer = () => {
  const { state: adminProductsState } = useAdminProductsState();
  const {
    dependencies: {
      services: { productType: productTypeService },
    },
  } = useDependencies();

  const history = useHistory();

  return (
    <AdminProductsListPresenter
      history={history}
      productTypeService={productTypeService}
      View={AdminProductsListView}
      adminProductsState={adminProductsState}
    />
  );
};
