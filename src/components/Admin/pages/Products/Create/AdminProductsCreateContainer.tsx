import * as React from 'react';
import { useHistory } from 'react-router';

import { AdminProductsCreatePresenter } from 'src/components/admin/pages/Products/Create/AdminProductsCreatePresenter';
import { AdminProductsCreateView } from 'src/components/admin/pages/Products/Create/AdminProductsCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureValuesState } from 'src/state/Admin/AdminFeatureValuesState';
import { useAdminProductsState } from 'src/state/Admin/AdminProductsState';

export const AdminProductsCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { state: adminFeatureValuesState } = useAdminFeatureValuesState();
  const { state: adminProductsState } = useAdminProductsState();

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
