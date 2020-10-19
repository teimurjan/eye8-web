import * as React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminFeatureValuesEditPresenter } from 'src/components/admin/pages/FeatureValues/Edit/AdminFeatureValuesEditPresenter';
import { AdminFeatureValuesEditView } from 'src/components/admin/pages/FeatureValues/Edit/AdminFeatureValuesEditView';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureTypesState } from 'src/state/Admin/AdminFeatureTypesState';
import { useAdminFeatureValuesState } from 'src/state/Admin/AdminFeatureValuesState';

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
