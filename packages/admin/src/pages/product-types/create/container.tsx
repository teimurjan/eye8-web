import React from 'react';
import { useHistory } from 'react-router';

import { AdminProductTypesCreatePresenter } from '@eye8/admin/pages/product-types/create/presenter';
import { AdminProductTypesCreateView } from '@eye8/admin/pages/product-types/create/view';
import { useDI } from '@eye8/di';

import {
  useAdminCharacteristicValuesState,
  useAdminFeatureTypesState,
  useAdminProductTypesState,
  useAdminCategoriesState,
} from '../../../state';

export const AdminProductTypesCreateContainer = () => {
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
