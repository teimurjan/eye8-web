import React from 'react';
import { useHistory, useParams } from 'react-router';

import { useDI } from '@eye8/di';

import {
  useAdminCharacteristicValuesState,
  useAdminFeatureTypesState,
  useAdminProductTypesState,
  useAdminCategoriesState,
} from '../../../state';

import AdminProductTypesEditPresenter from './presenter';
import AdminProductTypesEditView from './view';

const AdminProductTypesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { di } = useDI();
  const adminCategoriesState = useAdminCategoriesState();
  const adminFeatureTypesState = useAdminFeatureTypesState();
  const adminProductTypesState = useAdminProductTypesState();
  const adminCharacteristicValuesState = useAdminCharacteristicValuesState();

  return (
    <AdminProductTypesEditPresenter
      productTypeId={parseInt(params.id, 10)}
      history={history}
      View={AdminProductTypesEditView}
      service={di.service.productType}
      adminProductTypesState={adminProductTypesState}
      adminCategoriesState={adminCategoriesState}
      adminFeatureTypesState={adminFeatureTypesState}
      adminCharacteristicValuesState={adminCharacteristicValuesState}
    />
  );
};

export default AdminProductTypesEditContainer;
