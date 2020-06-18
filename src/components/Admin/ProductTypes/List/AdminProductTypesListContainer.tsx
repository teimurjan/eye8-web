import * as React from 'react';
import { injectIntl } from 'react-intl';

import { AdminProductTypesListPresenter } from 'src/components/Admin/ProductTypes/List/AdminProductTypesListPresenter';
import { AdminProductTypesListView } from 'src/components/Admin/ProductTypes/List/AdminProductTypesListView';
import { useAdminProductTypesState } from 'src/state/AdminProductTypesState';
import { useIntlState } from 'src/state/IntlState';

export const AdminProductTypesListContainer = () => {
  const { intlState } = useIntlState();
  const { adminProductTypesState } = useAdminProductTypesState();

  return (
    <AdminProductTypesListPresenter
      View={injectIntl(AdminProductTypesListView)}
      adminProductTypesState={adminProductTypesState}
      intlState={intlState}
    />
  );
};
