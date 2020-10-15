import * as React from 'react';
import { useHistory } from 'react-router';

import { AdminProductTypesCreatePresenter } from 'src/components/Admin/ProductTypes/Create/AdminProductTypesCreatePresenter';
import { AdminProductTypesCreateView } from 'src/components/Admin/ProductTypes/Create/AdminProductTypesCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminCategoriesState } from 'src/state/Admin/AdminCategoriesState';
import { useAdminCharacteristicValuesState } from 'src/state/Admin/AdminCharacteristicValuesState';
import { useAdminFeatureTypesState } from 'src/state/Admin/AdminFeatureTypesState';
import { useAdminProductTypesState } from 'src/state/Admin/AdminProductTypesState';

export const AdminProductTypesCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { state: adminCategoriesState } = useAdminCategoriesState();
  const { state: adminFeatureTypesState } = useAdminFeatureTypesState();
  const { state: adminProductTypesState } = useAdminProductTypesState();
  const { state: adminCharacteristicValuesState } = useAdminCharacteristicValuesState();

  return (
    <AdminProductTypesCreatePresenter
      history={history}
      View={AdminProductTypesCreateView}
      service={dependencies.services.productType}
      adminProductTypesState={adminProductTypesState}
      adminCategoriesState={adminCategoriesState}
      adminFeatureTypesState={adminFeatureTypesState}
      adminCharacteristicValuesState={adminCharacteristicValuesState}
      stateCacheStorage={dependencies.storages.stateCache}
    />
  );
};
