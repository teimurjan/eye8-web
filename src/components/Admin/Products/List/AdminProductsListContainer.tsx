import * as React from 'react';
import { injectIntl } from 'react-intl';

import { AdminProductsListPresenter } from 'src/components/Admin/Products/List/AdminProductsListPresenter';
import { AdminProductsListView } from 'src/components/Admin/Products/List/AdminProductsListView';
import { useAdminProductsState } from 'src/state/AdminProductsState';
import { useIntlState } from 'src/state/IntlState';

export const AdminProductsListContainer = () => {
  const { intlState } = useIntlState();
  const { adminProductsState } = useAdminProductsState();

  return (
    <AdminProductsListPresenter
      View={injectIntl(AdminProductsListView)}
      adminProductsState={adminProductsState}
      intlState={intlState}
    />
  );
};
