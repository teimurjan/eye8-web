import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';

import { AdminProductsEditPresenter } from 'src/components/Admin/Products/Edit/AdminProductsEditPresenter';
import { AdminProductsEditView } from 'src/components/Admin/Products/Edit/AdminProductsEditView';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureValuesState } from 'src/state/AdminFeatureValuesState';
import { useAdminProductsState } from 'src/state/AdminProductsState';

export const AdminProductsEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { adminFeatureValuesState } = useAdminFeatureValuesState();
  const { adminProductsState } = useAdminProductsState();

  return (
    <AdminProductsEditPresenter
      productId={parseInt(params.id, 10)}
      history={history}
      View={injectIntl(AdminProductsEditView)}
      productService={dependencies.services.product}
      productTypeService={dependencies.services.productType}
      adminProductsState={adminProductsState}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
