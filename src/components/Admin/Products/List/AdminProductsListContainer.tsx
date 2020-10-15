import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';

import { AdminProductsListPresenter } from 'src/components/Admin/Products/List/AdminProductsListPresenter';
import { AdminProductsListView } from 'src/components/Admin/Products/List/AdminProductsListView';
import { useDependencies } from 'src/DI/DI';
import { useAdminProductsState } from 'src/state/Admin/AdminProductsState';

const View = injectIntl(AdminProductsListView);

export const AdminProductsListContainer = () => {
  const { state: adminProductsState } = useAdminProductsState();
  const {
    dependencies: {
      services: { productType: productTypeService },
    },
  } = useDependencies();

  const history = useHistory();

  return (
    <AdminProductsListPresenter
      history={history}
      productTypeService={productTypeService}
      View={View}
      adminProductsState={adminProductsState}
    />
  );
};
