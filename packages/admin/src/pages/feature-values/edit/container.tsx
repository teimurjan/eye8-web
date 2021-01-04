import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminFeatureValuesEditPresenter } from '@eye8/admin/pages/feature-values/edit/presenter';
import { AdminFeatureValuesEditView } from '@eye8/admin/pages/feature-values/edit/view';
import { useAdminFeatureTypesState } from '@eye8/admin/state/feature-types';
import { useAdminFeatureValuesState } from '@eye8/admin/state/feature-values';
import { useDependencies } from '@eye8/di';

export const AdminFeatureValuesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { state: adminFeatureTypesState } = useAdminFeatureTypesState();
  const { state: adminFeatureValuesState } = useAdminFeatureValuesState();

  return (
    <AdminFeatureValuesEditPresenter
      featureValueId={parseInt(params.id, 10)}
      history={history}
      View={AdminFeatureValuesEditView}
      service={dependencies.services.featureValue}
      adminFeatureTypesState={adminFeatureTypesState}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
