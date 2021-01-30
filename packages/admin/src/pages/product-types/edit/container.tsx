import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminProductTypesEditPresenter } from '@eye8/admin/pages/product-types/edit/presenter';
import { AdminProductTypesEditView } from '@eye8/admin/pages/product-types/edit/view';
import { useDI } from '@eye8/di';

import {
  useAdminCharacteristicValuesState,
  useAdminFeatureTypesState,
  useAdminProductTypesState,
  useAdminCategoriesState,
} from '../../../state';

export const AdminProductTypesEditContainer = () => {
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
