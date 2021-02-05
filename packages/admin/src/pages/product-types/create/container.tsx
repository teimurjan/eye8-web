import React from 'react';
import { useHistory } from 'react-router';

import { useDI } from '@eye8/di';

import {
  useAdminCharacteristicValuesState,
  useAdminFeatureTypesState,
  useAdminProductTypesState,
  useAdminCategoriesState,
} from '../../../state';

import AdminProductTypesCreatePresenter from './presenter';
import AdminProductTypesCreateView from './view';

const AdminProductTypesCreateContainer = () => {
  const history = useHistory();

  const { di } = useDI();
  const adminCategoriesState = useAdminCategoriesState();
  const adminFeatureTypesState = useAdminFeatureTypesState();
  const adminProductTypesState = useAdminProductTypesState();
  const adminCharacteristicValuesState = useAdminCharacteristicValuesState();

  return (
    <AdminProductTypesCreatePresenter
      history={history}
      View={AdminProductTypesCreateView}
      service={di.service.productType}
      adminProductTypesState={adminProductTypesState}
      adminCategoriesState={adminCategoriesState}
      adminFeatureTypesState={adminFeatureTypesState}
      adminCharacteristicValuesState={adminCharacteristicValuesState}
      stateCacheStorage={di.storage.stateCache}
    />
  );
};

export default AdminProductTypesCreateContainer;
