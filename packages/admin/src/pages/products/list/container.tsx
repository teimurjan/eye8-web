import React from 'react';
import { useHistory } from 'react-router';

import { AdminProductsListPresenter } from '@eye8/admin/pages/products/list/presenter';
import { AdminProductsListView } from '@eye8/admin/pages/products/list/view';
import { useAdminProductsState } from '@eye8/admin/state/products';
import { useDependencies } from '@eye8/di';

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