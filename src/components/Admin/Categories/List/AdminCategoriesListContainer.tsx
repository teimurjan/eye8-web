import * as React from 'react';
import { injectIntl } from 'react-intl';

import { AdminCategoriesListPresenter } from 'src/components/Admin/Categories/List/AdminCategoriesListPresenter';
import { AdminCategoriesListView } from 'src/components/Admin/Categories/List/AdminCategoriesListView';
import { useAdminCategoriesState } from 'src/state/AdminCategoriesState';
import { useIntlState } from 'src/state/IntlState';

export const AdminCategoriesListContainer = () => {
  const { intlState } = useIntlState();
  const { adminCategoriesState } = useAdminCategoriesState();

  return (
    <AdminCategoriesListPresenter
      View={injectIntl(AdminCategoriesListView)}
      adminCategoriesState={adminCategoriesState}
      intlState={intlState}
    />
  );
};
