import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';

import { AdminProductsListPresenter } from 'src/components/Admin/Products/List/AdminProductsListPresenter';
import { AdminProductsListView } from 'src/components/Admin/Products/List/AdminProductsListView';
import { useDependencies } from 'src/DI/DI';
import { useAdminProductsFiltersState } from 'src/state/AdminProductsFiltersState';
import { useAdminProductsState } from 'src/state/AdminProductsState';
import { useIntlState } from 'src/state/IntlState';

const View = injectIntl(AdminProductsListView);

export const AdminProductsListContainer = () => {
  const { intlState } = useIntlState();
  const { state: adminProductsState } = useAdminProductsState();
  const {
    dependencies: {
      services: { productType: productTypeService },
    },
  } = useDependencies();

  const {
    adminProductsFiltersState: {
      filters: { productTypeId },
      setFilters,
    },
  } = useAdminProductsFiltersState();

  const onProductTypeChange = React.useCallback(
    (productTypeId_?: number) => {
      setFilters({ productTypeId: productTypeId_ });
    },
    [setFilters],
  );

  const history = useHistory();

  return (
    <AdminProductsListPresenter
      history={history}
      productTypeService={productTypeService}
      productTypeId={productTypeId as number | undefined}
      onProductTypeChange={onProductTypeChange}
      View={View}
      adminProductsState={adminProductsState}
      intlState={intlState}
    />
  );
};
