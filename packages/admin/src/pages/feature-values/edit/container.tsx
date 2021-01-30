import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminFeatureValuesEditPresenter } from '@eye8/admin/pages/feature-values/edit/presenter';
import { AdminFeatureValuesEditView } from '@eye8/admin/pages/feature-values/edit/view';
import { useDI } from '@eye8/di';

import { useAdminFeatureTypesState } from '../../../state';
import { useAdminFeatureValuesState } from '../../../state';

export const AdminFeatureValuesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { di } = useDI();
  const adminFeatureTypesState = useAdminFeatureTypesState();
  const adminFeatureValuesState = useAdminFeatureValuesState();

  return (
    <AdminFeatureValuesEditPresenter
      featureValueId={parseInt(params.id, 10)}
      history={history}
      View={AdminFeatureValuesEditView}
      service={di.service.featureValue}
      adminFeatureTypesState={adminFeatureTypesState}
      adminFeatureValuesState={adminFeatureValuesState}
    />
  );
};
