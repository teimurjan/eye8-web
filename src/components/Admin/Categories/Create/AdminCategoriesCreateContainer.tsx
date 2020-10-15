import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';

import { AdminCategoriesCreatePresenter } from 'src/components/Admin/Categories/Create/AdminCategoriesCreatePresenter';
import { AdminCategoriesCreateView } from 'src/components/Admin/Categories/Create/AdminCategoriesCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminCategoriesState } from 'src/state/Admin/AdminCategoriesState';

const View = injectIntl(AdminCategoriesCreateView);

export const AdminCategoriesCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { state: adminCategoriesState } = useAdminCategoriesState();

  return (
    <AdminCategoriesCreatePresenter
      history={history}
      View={View}
      service={dependencies.services.category}
      adminCategoriesState={adminCategoriesState}
    />
  );
};
