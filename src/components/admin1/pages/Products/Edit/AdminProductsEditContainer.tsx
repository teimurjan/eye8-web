import * as React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminProductsEditPresenter } from 'src/components/admin/pages/Products/Edit/AdminProductsEditPresenter';
import { AdminProductsEditView } from 'src/components/admin/pages/Products/Edit/AdminProductsEditView';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureValuesState } from 'src/state/Admin/AdminFeatureValuesState';
import { useAdminProductsState } from 'src/state/Admin/AdminProductsState';

export const AdminProductsEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { state: adminFeatureValuesState } = useAdminFeatureValuesState();
  const { state: adminProductsState } = useAdminProductsState();

  const close = React.useCallback(() => history.push('/admin/products'), [history]);

  return (
    <AdminProductsEditPresenter
      productId={parseInt(params.id, 10)}
      history={history}
      View={AdminProductsEditView}
      productService={dependencies.services.product}
      productTypeService={dependencies.services.productType}
      adminProductsState={adminProductsState}
      adminFeatureValuesState={adminFeatureValuesState}
      close={close}
    />
  );
};
