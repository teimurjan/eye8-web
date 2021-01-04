import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminProductTypesEditPresenter } from '@eye8/admin/pages/product-types/edit/presenter';
import { AdminProductTypesEditView } from '@eye8/admin/pages/product-types/edit/view';
import { useAdminCategoriesState } from '@eye8/admin/state/categories';
import { useAdminCharacteristicValuesState } from '@eye8/admin/state/characteristic-values';
import { useAdminFeatureTypesState } from '@eye8/admin/state/feature-types';
import { useAdminProductTypesState } from '@eye8/admin/state/product-types';
import { useDependencies } from '@eye8/di';

export const AdminProductTypesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { state: adminCategoriesState } = useAdminCategoriesState();
  const { state: adminFeatureTypesState } = useAdminFeatureTypesState();
  const { state: adminProductTypesState } = useAdminProductTypesState();
  const { state: adminCharacteristicValuesState } = useAdminCharacteristicValuesState();

  return (
    <AdminProductTypesEditPresenter
      productTypeId={parseInt(params.id, 10)}
      history={history}
      View={AdminProductTypesEditView}
      service={dependencies.services.productType}
      adminProductTypesState={adminProductTypesState}
      adminCategoriesState={adminCategoriesState}
      adminFeatureTypesState={adminFeatureTypesState}
      adminCharacteristicValuesState={adminCharacteristicValuesState}
    />
  );
};
