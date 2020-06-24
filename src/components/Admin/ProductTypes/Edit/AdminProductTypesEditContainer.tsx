import * as React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminProductTypesEditPresenter } from 'src/components/Admin/ProductTypes/Edit/AdminProductTypesEditPresenter';
import { AdminProductTypesEditView } from 'src/components/Admin/ProductTypes/Edit/AdminProductTypesEditView';
import { useDependencies } from 'src/DI/DI';
import { useAdminCategoriesState } from 'src/state/AdminCategoriesState';
import { useAdminFeatureTypesState } from 'src/state/AdminFeatureTypesState';
import { useAdminProductTypesState } from 'src/state/AdminProductTypesState';
import { useIntlState } from 'src/state/IntlState';

export const AdminProductTypesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { adminCategoriesState } = useAdminCategoriesState();
  const { adminFeatureTypesState } = useAdminFeatureTypesState();
  const { adminProductTypesState } = useAdminProductTypesState();
  const { intlState } = useIntlState();

  return (
    <AdminProductTypesEditPresenter
      productTypeId={parseInt(params.id, 10)}
      history={history}
      View={AdminProductTypesEditView}
      service={dependencies.services.productType}
      intlState={intlState}
      adminProductTypesState={adminProductTypesState}
      adminCategoriesState={adminCategoriesState}
      adminFeatureTypesState={adminFeatureTypesState}
    />
  );
};
