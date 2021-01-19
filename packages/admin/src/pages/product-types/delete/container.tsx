import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminProductTypesState } from '@eye8/admin/state/product-types';
import { useDI } from '@eye8/di';
import { ProductTypeHasProductsError } from '@eye8/service/product-type';

const getErrorMessageID = (e: Error) => {
  if (e instanceof ProductTypeHasProductsError) {
    return 'AdminProductTypes.errors.hasProducts';
  }

  return 'errors.common';
};

export const AdminProductTypesDeleteContainer = () => {
  const { di } = useDI();
  const {
    state: { remove: deleteProductType },
  } = useAdminProductTypesState();

  return (
    <DeleteModalContainer
      getErrorMessageID={getErrorMessageID}
      deleteEntity={async ({ id, deleted }) => {
        await di.service.productType.delete(id, { forever: deleted });
        deleteProductType(id);
      }}
      checkExistence={({ id, deleted }) => di.service.productType.exists(id, { deleted })}
      getBackPath={() => `/admin/productTypes`}
    />
  );
};
