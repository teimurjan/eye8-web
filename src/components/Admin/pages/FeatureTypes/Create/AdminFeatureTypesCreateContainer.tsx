import * as React from 'react';
import { useHistory } from 'react-router';

import { AdminFeatureTypesCreatePresenter } from 'src/components/admin/pages/FeatureTypes/Create/AdminFeatureTypesCreatePresenter';
import { AdminFeatureTypesCreateView } from 'src/components/admin/pages/FeatureTypes/Create/AdminFeatureTypesCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureTypesState } from 'src/state/Admin/AdminFeatureTypesState';

export const AdminFeatureTypesCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { state: adminFeatureTypesState } = useAdminFeatureTypesState();

  return (
    <AdminFeatureTypesCreatePresenter
      history={history}
      View={AdminFeatureTypesCreateView}
      service={dependencies.services.featureType}
      adminFeatureTypesState={adminFeatureTypesState}
    />
  );
};
