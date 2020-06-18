import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';

import { AdminCategoriesCreatePresenter } from 'src/components/Admin/Categories/Create/AdminCategoriesCreatePresenter';
import { AdminCategoriesCreateView } from 'src/components/Admin/Categories/Create/AdminCategoriesCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminCategoriesState } from 'src/state/AdminCategoriesState';
import { useIntlState } from 'src/state/IntlState';

export const AdminCategoriesCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { adminCategoriesState } = useAdminCategoriesState();
  const { intlState } = useIntlState();

  return (
    <AdminCategoriesCreatePresenter
      history={history}
      View={injectIntl(AdminCategoriesCreateView)}
      service={dependencies.services.category}
      intlState={intlState}
      adminCategoriesState={adminCategoriesState}
    />
  );
};
