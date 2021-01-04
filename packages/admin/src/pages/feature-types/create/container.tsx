import React from 'react';
import { useHistory } from 'react-router';

import { AdminFeatureTypesCreatePresenter } from '@eye8/admin/pages/feature-types/create/presenter';
import { AdminFeatureTypesCreateView } from '@eye8/admin/pages/feature-types/create/view';
import { useAdminFeatureTypesState } from '@eye8/admin/state/feature-types';
import { useDependencies } from '@eye8/di';

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
