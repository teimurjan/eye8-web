import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminProductsEditPresenter } from '@eye8/admin/pages/products/edit/presenter';
import { AdminProductsEditView } from '@eye8/admin/pages/products/edit/view';
import { useDI } from '@eye8/di';

import { useAdminFeatureValuesState, useAdminProductsState } from '../../../state';

export const AdminProductsEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { di } = useDI();
  const adminFeatureValuesState = useAdminFeatureValuesState();
  const adminProductsState = useAdminProductsState();

  const close = React.useCallback(() => history.push('/admin/products'), [history]);

  return (
    <AdminProductsEditPresenter
      productId={parseInt(params.id, 10)}
      history={history}
      View={AdminProductsEditView}
      productService={di.service.product}
      productTypeService={di.service.productType}
      adminProductsState={adminProductsState}
      adminFeatureValuesState={adminFeatureValuesState}
      close={close}
    />
  );
};
