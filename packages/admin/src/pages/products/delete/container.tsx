import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminProductsState } from '@eye8/admin/state/products';
import { useDI } from '@eye8/di';

export const AdminProductsDeleteContainer = () => {
  const { di } = useDI();
  const {
    state: { remove: deleteProduct },
  } = useAdminProductsState();

  return (
    <DeleteModalContainer
      deleteEntity={async ({ id, deleted }) => {
        await di.service.product.delete(id, { forever: deleted });
        deleteProduct(id);
      }}
      checkExistence={({ id, deleted }) => di.service.product.exists(id, { deleted })}
      getBackPath={() => '/admin/products'}
    />
  );
};
