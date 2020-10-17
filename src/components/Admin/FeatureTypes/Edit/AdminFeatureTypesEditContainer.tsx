import * as React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminFeatureTypesEditPresenter } from 'src/components/Admin/FeatureTypes/Edit/AdminFeatureTypesEditPresenter';
import { AdminFeatureTypesEditView } from 'src/components/Admin/FeatureTypes/Edit/AdminFeatureTypesEditView';
import { useDependencies } from 'src/DI/DI';
import { useAdminFeatureTypesState } from 'src/state/Admin/AdminFeatureTypesState';

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
