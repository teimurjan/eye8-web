import * as React from 'react';
import { injectIntl } from 'react-intl';

import { AdminProductTypesListPresenter } from 'src/components/Admin/ProductTypes/List/AdminProductTypesListPresenter';
import { AdminProductTypesListView } from 'src/components/Admin/ProductTypes/List/AdminProductTypesListView';
import { useDependencies } from 'src/DI/DI';
import { useAdminProductTypesState } from 'src/state/AdminProductTypesState';

const View = injectIntl(AdminProductTypesListView);

export const AdminProductTypesListContainer = () => {
  const { state: adminProductTypesState } = useAdminProductTypesState();
  const {
    dependencies: {
      services: { search: searchService },
    },
  } = useDependencies();

  return (
    <AdminProductTypesListPresenter
      View={View}
      adminProductTypesState={adminProductTypesState}
      searchService={searchService}
    />
  );
};
