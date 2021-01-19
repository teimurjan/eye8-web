import React from 'react';
import { useHistory } from 'react-router';

import { AdminProductsCreatePresenter } from '@eye8/admin/pages/products/create/presenter';
import { AdminProductsCreateView } from '@eye8/admin/pages/products/create/view';
import { useAdminFeatureValuesState } from '@eye8/admin/state/feature-values';
import { useAdminProductsState } from '@eye8/admin/state/products';
import { useDI } from '@eye8/di';

export const AdminProductsCreateContainer = () => {
  const history = useHistory();

  const { di } = useDI();
  const { state: adminFeatureValuesState } = useAdminFeatureValuesState();
  const { state: adminProductsState } = useAdminProductsState();

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
