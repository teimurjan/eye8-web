import React from 'react';
import { useHistory } from 'react-router';

import { AdminProductTypesCreatePresenter } from '@eye8/admin/pages/product-types/create/presenter';
import { AdminProductTypesCreateView } from '@eye8/admin/pages/product-types/create/view';
import { useAdminCategoriesState } from '@eye8/admin/state/categories';
import { useAdminCharacteristicValuesState } from '@eye8/admin/state/characteristic-values';
import { useAdminFeatureTypesState } from '@eye8/admin/state/feature-types';
import { useAdminProductTypesState } from '@eye8/admin/state/product-types';
import { useDI } from '@eye8/di';

export const AdminProductTypesCreateContainer = () => {
  const history = useHistory();

  const { di } = useDI();
  const { state: adminCategoriesState } = useAdminCategoriesState();
  const { state: adminFeatureTypesState } = useAdminFeatureTypesState();
  const { state: adminProductTypesState } = useAdminProductTypesState();
  const { state: adminCharacteristicValuesState } = useAdminCharacteristicValuesState();

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
