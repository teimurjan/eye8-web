import React from 'react';
import { useHistory } from 'react-router';

import { useDI } from '@eye8/di';

import { useAdminFeatureTypesState } from '../../../state';

import AdminFeatureTypesCreatePresenter from './presenter';
import AdminFeatureTypesCreateView from './view';


const AdminFeatureTypesCreateContainer = () => {
  const history = useHistory();

  const { di } = useDI();
  const adminFeatureTypesState = useAdminFeatureTypesState();

  return (
    <AdminFeatureTypesCreatePresenter
      history={history}
      View={AdminFeatureTypesCreateView}
      service={di.service.featureType}
      adminFeatureTypesState={adminFeatureTypesState}
    />
  );
};

export default AdminFeatureTypesCreateContainer;
