import React from 'react';
import { useHistory } from 'react-router';

import { useDI } from '@eye8/di';

import { useAdminProductsState } from '../../../state';

import AdminProductsListPresenter from './presenter';
import AdminProductsListView from './view';

const AdminProductsListContainer = () => {
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

export default AdminProductsListContainer;
