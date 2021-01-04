import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminProductsState } from '@eye8/admin/state/products';
import { useDependencies } from '@eye8/di';

export const AdminProductsDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    state: { remove: deleteProduct },
  } = useAdminProductsState();

  return (
    <DeleteModalContainer
      deleteEntity={async ({ id, deleted }) => {
        await dependencies.services.product.delete(id, { forever: deleted });
        deleteProduct(id);
      }}
      checkExistence={({ id, deleted }) => dependencies.services.product.exists(id, { deleted })}
      getBackPath={() => '/admin/products'}
    />
  );
};
