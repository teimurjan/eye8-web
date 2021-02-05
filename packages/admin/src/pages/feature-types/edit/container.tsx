import React from 'react';
import { useHistory, useParams } from 'react-router';

import { useDI } from '@eye8/di';

import { useAdminFeatureTypesState } from '../../../state';

import AdminFeatureTypesEditPresenter from './presenter';
import AdminFeatureTypesEditView from './view';


const AdminFeatureTypesEditContainer = () => {
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

export default AdminFeatureTypesEditContainer;
