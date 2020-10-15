import * as React from 'react';
import { injectIntl } from 'react-intl';

import { AdminCategoriesListPresenter } from 'src/components/Admin/Categories/List/AdminCategoriesListPresenter';
import { AdminCategoriesListView } from 'src/components/Admin/Categories/List/AdminCategoriesListView';
import { useAdminCategoriesState } from 'src/state/Admin/AdminCategoriesState';

const View = injectIntl(AdminCategoriesListView);

export const AdminCategoriesListContainer = () => {
  const { state: adminCategoriesState } = useAdminCategoriesState();

  return <AdminCategoriesListPresenter View={View} adminCategoriesState={adminCategoriesState} />;
};
