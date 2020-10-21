import * as React from 'react';

import { DeleteModalContainer } from 'src/components/admin/table/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import { useAdminProductsState } from 'src/state/Admin/AdminProductsState';

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
