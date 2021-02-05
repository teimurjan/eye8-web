import React from 'react';
import { useHistory, useParams } from 'react-router';

import { useDI } from '@eye8/di';

import { useAdminFeatureTypesState, useAdminFeatureValuesState } from '../../../state';

import AdminFeatureValuesEditPresenter from './presenter';
import AdminFeatureValuesEditView from './view';


const AdminFeatureValuesEditContainer = () => {
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

export default AdminFeatureValuesEditContainer;
