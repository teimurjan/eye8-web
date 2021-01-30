import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminFeatureTypesEditPresenter } from '@eye8/admin/pages/feature-types/edit/presenter';
import { AdminFeatureTypesEditView } from '@eye8/admin/pages/feature-types/edit/view';
import { useDI } from '@eye8/di';

import { useAdminFeatureTypesState } from '../../../state';

export const AdminFeatureTypesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { di } = useDI();
  const adminFeatureTypesState = useAdminFeatureTypesState();

  return (
    <AdminFeatureTypesEditPresenter
      featureTypeId={parseInt(params.id, 10)}
      history={history}
      View={AdminFeatureTypesEditView}
      service={di.service.featureType}
      adminFeatureTypesState={adminFeatureTypesState}
    />
  );
};
