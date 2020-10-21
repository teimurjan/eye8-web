import * as React from 'react';

import { DeleteModalContainer } from 'src/components/admin/table/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import * as productTypeService from 'src/services/ProductTypeService';
import { useAdminProductTypesState } from 'src/state/Admin/AdminProductTypesState';

const getErrorMessageID = (e: Error) => {
  if (e instanceof productTypeService.errors.ProductTypeHasProducts) {
    return 'AdminProductTypes.errors.hasProducts';
  }

  return 'errors.common';
};

export const AdminProductTypesDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    state: { remove: deleteProductType },
  } = useAdminProductTypesState();

  return (
    <DeleteModalContainer
      getErrorMessageID={getErrorMessageID}
      deleteEntity={async ({ id, deleted }) => {
        await dependencies.services.productType.delete(id, { forever: deleted });
        deleteProductType(id);
      }}
      checkExistence={({ id, deleted }) => dependencies.services.productType.exists(id, { deleted })}
      getBackPath={() => `/admin/productTypes`}
    />
  );
};
