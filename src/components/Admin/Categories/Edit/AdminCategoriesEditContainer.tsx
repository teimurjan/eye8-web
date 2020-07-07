import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory, useParams } from 'react-router';

import { AdminCategoriesEditPresenter } from 'src/components/Admin/Categories/Edit/AdminCategoriesEditPresenter';
import { AdminCategoriesEditView } from 'src/components/Admin/Categories/Edit/AdminCategoriesEditView';
import { useDependencies } from 'src/DI/DI';
import { useAdminCategoriesState } from 'src/state/AdminCategoriesState';
import { useIntlState } from 'src/state/IntlState';

const View = injectIntl(AdminCategoriesEditView);

export const AdminCategoriesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { adminCategoriesState } = useAdminCategoriesState();
  const { intlState } = useIntlState();

  return (
    <AdminCategoriesEditPresenter
      categoryId={parseInt(params.id, 10)}
      history={history}
      View={View}
      service={dependencies.services.category}
      intlState={intlState}
      adminCategoriesState={adminCategoriesState}
    />
  );
};
