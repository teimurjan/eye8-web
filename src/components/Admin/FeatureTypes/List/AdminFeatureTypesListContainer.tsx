import * as React from 'react';
import { injectIntl } from 'react-intl';

import { AdminFeatureTypesListPresenter } from 'src/components/Admin/FeatureTypes/List/AdminFeatureTypesListPresenter';
import { AdminFeatureTypesListView } from 'src/components/Admin/FeatureTypes/List/AdminFeatureTypesListView';
import { useAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';
import { useIntlState } from 'src/state/IntlState';

export const AdminFeatureTypesListContainer = () => {
  const { adminFeatureTypesState } = useAdminFeatureTypesState();
  const { intlState } = useIntlState();

  return (
    <AdminFeatureTypesListPresenter
      View={injectIntl(AdminFeatureTypesListView)}
      adminFeatureTypesState={adminFeatureTypesState}
      intlState={intlState}
    />
  );
};
