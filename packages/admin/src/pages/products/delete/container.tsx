import React from 'react';

import { useDI } from '@eye8/di';

import { DeleteModal } from '../../../components';
import { useAdminProductsState } from '../../../state';

const AdminProductsDeleteContainer = () => {
  const { di } = useDI();
  const { remove: deleteProduct } = useAdminProductsState();

  return (
    <DeleteModal
      deleteEntity={async ({ id, deleted }) => {
        await di.service.product.delete(id, { forever: deleted });
        deleteProduct(id);
      }}
      checkExistence={({ id, deleted }) => di.service.product.exists(id, { deleted })}
      getBackPath={() => '/admin/products'}
    />
  );
};

export default AdminProductsDeleteContainer;
