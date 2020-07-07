import * as React from 'react';
import { injectIntl } from 'react-intl';

import { AdminFeatureValuesListPresenter } from 'src/components/Admin/FeatureValues/List/AdminFeatureValuesListPresenter';
import { AdminFeatureValuesListView } from 'src/components/Admin/FeatureValues/List/AdminFeatureValuesListView';
import { useAdminFeatureValuesState } from 'src/state/AdminFeatureValuesState';
import { useIntlState } from 'src/state/IntlState';

const View = injectIntl(AdminFeatureValuesListView);

export const AdminFeatureValuesListContainer = () => {
  const { intlState } = useIntlState();
  const { adminFeatureValuesState } = useAdminFeatureValuesState();

  return (
    <AdminFeatureValuesListPresenter
      View={View}
      adminFeatureValuesState={adminFeatureValuesState}
      intlState={intlState}
    />
  );
};
