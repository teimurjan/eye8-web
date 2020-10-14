import * as React from 'react';
import { injectIntl } from 'react-intl';

import { AdminFeatureTypesListPresenter } from 'src/components/Admin/FeatureTypes/List/AdminFeatureTypesListPresenter';
import { AdminFeatureTypesListView } from 'src/components/Admin/FeatureTypes/List/AdminFeatureTypesListView';
import { useAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';

const View = injectIntl(AdminFeatureTypesListView);

export const AdminFeatureTypesListContainer = () => {
  const { state: adminFeatureTypesState } = useAdminFeatureTypesState();

  return <AdminFeatureTypesListPresenter View={View} adminFeatureTypesState={adminFeatureTypesState} />;
};
