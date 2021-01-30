import React from 'react';

import { useDI } from '@eye8/di';
import { ProductTypeHasProductsError } from '@eye8/service/product-type';

import { DeleteModal } from '../../../components';
import { useAdminProductTypesState } from '../../../state';

const getErrorMessageID = (e: Error) => {
  if (e instanceof ProductTypeHasProductsError) {
    return 'AdminProductTypes.errors.hasProducts';
  }

  return 'errors.common';
};

export const AdminProductTypesDeleteContainer = () => {
  const { di } = useDI();
  const { remove: deleteProductType } = useAdminProductTypesState();

  return (
    <DeleteModal
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
