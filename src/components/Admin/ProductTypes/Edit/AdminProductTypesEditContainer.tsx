import * as React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminProductTypesEditPresenter } from 'src/components/Admin/ProductTypes/Edit/AdminProductTypesEditPresenter';
import { AdminProductTypesEditView } from 'src/components/Admin/ProductTypes/Edit/AdminProductTypesEditView';
import { useDependencies } from 'src/DI/DI';
import { useAdminCategoriesState } from 'src/state/Admin/AdminCategoriesState';
import { useAdminCharacteristicValuesState } from 'src/state/Admin/AdminCharacteristicValuesState';
import { useAdminFeatureTypesState } from 'src/state/Admin/AdminFeatureTypesState';
import { useAdminProductTypesState } from 'src/state/Admin/AdminProductTypesState';

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
