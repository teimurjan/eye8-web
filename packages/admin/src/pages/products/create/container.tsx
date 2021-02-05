import React from 'react';
import { useHistory } from 'react-router';

import { useDI } from '@eye8/di';

import { useAdminFeatureValuesState, useAdminProductsState } from '../../../state';

import AdminProductsCreatePresenter from './presenter';
import AdminProductsCreateView from './view';


const AdminProductsCreateContainer = () => {
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

export default AdminProductsCreateContainer;
