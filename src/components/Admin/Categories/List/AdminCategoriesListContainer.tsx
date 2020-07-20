import * as React from 'react';
import { injectIntl } from 'react-intl';

import { AdminCategoriesListPresenter } from 'src/components/Admin/Categories/List/AdminCategoriesListPresenter';
import { AdminCategoriesListView } from 'src/components/Admin/Categories/List/AdminCategoriesListView';
import { useAdminCategoriesState } from 'src/state/AdminCategoriesState';
import { useIntlState } from 'src/state/IntlState';

const View = injectIntl(AdminCategoriesListView);

export const AdminCategoriesListContainer = () => {
  const { intlState } = useIntlState();
  const { state: adminCategoriesState } = useAdminCategoriesState();

  return <AdminCategoriesListPresenter View={View} adminCategoriesState={adminCategoriesState} intlState={intlState} />;
};
