import * as React from 'react';
import { injectIntl } from 'react-intl';

import { AdminFeatureValuesListPresenter } from 'src/components/Admin/FeatureValues/List/AdminFeatureValuesListPresenter';
import { AdminFeatureValuesListView } from 'src/components/Admin/FeatureValues/List/AdminFeatureValuesListView';
import { useAdminFeatureValuesState } from 'src/state/AdminFeatureValuesState';

const View = injectIntl(AdminFeatureValuesListView);

export const AdminFeatureValuesListContainer = () => {
  const { state: adminFeatureValuesState } = useAdminFeatureValuesState();

  return <AdminFeatureValuesListPresenter View={View} adminFeatureValuesState={adminFeatureValuesState} />;
};
