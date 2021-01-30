import React from 'react';
import { useHistory } from 'react-router';

import { AdminProductsListPresenter } from '@eye8/admin/pages/products/list/presenter';
import { AdminProductsListView } from '@eye8/admin/pages/products/list/view';
import { useDI } from '@eye8/di';

import { useAdminProductsState } from '../../../state';

export const AdminProductsListContainer = () => {
  const adminProductsState = useAdminProductsState();
  const {
    di: {
      service: { productType: productTypeService },
    },
  } = useDI();

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
