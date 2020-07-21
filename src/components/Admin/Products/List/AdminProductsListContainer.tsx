import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useLocation } from 'react-router';

import { AdminProductsListPresenter } from 'src/components/Admin/Products/List/AdminProductsListPresenter';
import { AdminProductsListView } from 'src/components/Admin/Products/List/AdminProductsListView';
import { useAdminProductsState } from 'src/state/AdminProductsState';
import { useIntlState } from 'src/state/IntlState';

const View = injectIntl(AdminProductsListView);

export const AdminProductsListContainer = () => {
  const { intlState } = useIntlState();
  const { state: adminProductsState } = useAdminProductsState();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const productTypeId = searchParams.get('productTypeId');

  return (
    <AdminProductsListPresenter
      productTypeId={productTypeId ?? undefined}
      View={View}
      adminProductsState={adminProductsState}
      intlState={intlState}
    />
  );
};
