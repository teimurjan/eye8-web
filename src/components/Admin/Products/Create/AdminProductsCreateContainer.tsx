import * as React from 'react';
import { useHistory } from 'react-router';

import { AdminProductsCreatePresenter } from 'src/components/Admin/Products/Create/AdminProductsCreatePresenter';
import { AdminProductsCreateView } from 'src/components/Admin/Products/Create/AdminProductsCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureValuesState } from 'src/state/AdminFeatureValuesState';
import { useAdminProductsState } from 'src/state/AdminProductsState';

export const AdminProductsCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { adminFeatureValuesState } = useAdminFeatureValuesState();
  const { adminProductsState } = useAdminProductsState();

  return (
    <AdminProductsCreatePresenter
      history={history}
      View={AdminProductsCreateView}
      productService={dependencies.services.product}
      productTypeService={dependencies.services.productType}
      adminProductsState={adminProductsState}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
