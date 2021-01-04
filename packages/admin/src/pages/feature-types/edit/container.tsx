import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminFeatureTypesEditPresenter } from '@eye8/admin/pages/feature-types/edit/presenter';
import { AdminFeatureTypesEditView } from '@eye8/admin/pages/feature-types/edit/view';
import { useAdminFeatureTypesState } from '@eye8/admin/state/feature-types';
import { useDependencies } from '@eye8/di';

export const AdminFeatureTypesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { state: adminFeatureTypesState } = useAdminFeatureTypesState();

  return (
    <AdminFeatureTypesEditPresenter
      featureTypeId={parseInt(params.id, 10)}
      history={history}
      View={AdminFeatureTypesEditView}
      service={dependencies.services.featureType}
      adminFeatureTypesState={adminFeatureTypesState}
    />
  );
};
