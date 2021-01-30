import React from 'react';
import { useHistory } from 'react-router';

import { AdminProductsCreatePresenter } from '@eye8/admin/pages/products/create/presenter';
import { AdminProductsCreateView } from '@eye8/admin/pages/products/create/view';
import { useDI } from '@eye8/di';

import { useAdminFeatureValuesState, useAdminProductsState } from '../../../state';

export const AdminProductsCreateContainer = () => {
  const history = useHistory();

  const { di } = useDI();
  const adminFeatureValuesState = useAdminFeatureValuesState();
  const adminProductsState = useAdminProductsState();

  return (
    <AdminProductsCreatePresenter
      history={history}
      View={AdminProductsCreateView}
      productService={di.service.product}
      productTypeService={di.service.productType}
      adminProductsState={adminProductsState}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
