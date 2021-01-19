import React from 'react';
import { useHistory } from 'react-router';

import { AdminFeatureTypesCreatePresenter } from '@eye8/admin/pages/feature-types/create/presenter';
import { AdminFeatureTypesCreateView } from '@eye8/admin/pages/feature-types/create/view';
import { useAdminFeatureTypesState } from '@eye8/admin/state/feature-types';
import { useDI } from '@eye8/di';

export const AdminFeatureTypesCreateContainer = () => {
  const history = useHistory();

  const { di } = useDI();
  const { state: adminFeatureTypesState } = useAdminFeatureTypesState();

  return (
    <AdminFeatureTypesCreatePresenter
      history={history}
      View={AdminFeatureTypesCreateView}
      service={di.service.featureType}
      adminFeatureTypesState={adminFeatureTypesState}
    />
  );
};
