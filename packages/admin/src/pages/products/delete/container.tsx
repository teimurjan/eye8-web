import React from 'react';

import { useDI } from '@eye8/di';
import { buildSearchString } from '@eye8/shared/utils';

import { DeleteModal } from '../../../components';
import { useAdminProductsFilters } from '../../../hooks';
import { useAdminProductsState } from '../../../state';

const AdminProductsDeleteContainer = () => {
  const { di } = useDI();
  const { remove: deleteProduct } = useAdminProductsState();
  const {
    filters: { deleted },
  } = useAdminProductsFilters();

  return (
    <DeleteModal
      deleteEntity={async ({ id }) => {
        await di.service.product.delete(id, { forever: deleted });
        deleteProduct(id);
      }}
      checkExistence={({ id }) => di.service.product.exists(id, { deleted })}
      getBackPath={() => `/admin/products${buildSearchString({ deleted })}`}
    />
  );
};

export default AdminProductsDeleteContainer;
