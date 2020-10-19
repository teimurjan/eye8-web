import * as React from 'react';

import { DeleteModalContainer } from 'src/components/admin/table/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import * as productTypeService from 'src/services/ProductTypeService';
import { useAdminProductTypesState } from 'src/state/Admin/AdminProductTypesState';
import { buildSearchString } from 'src/utils/queryString';

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

  const deleteEntity = React.useCallback(
    async (id: number, forever?: boolean) => {
      await dependencies.services.productType.delete(id, { forever: forever });
      deleteProductType(id);
    },
    [deleteProductType, dependencies.services.productType],
  );

  const preloadData = React.useCallback(
    async ({ id, setError, setIsLoading, forever }) => {
      try {
        setIsLoading(true);
        const isExists = await dependencies.services.productType.exists(id, { deleted: forever });
        if (!isExists) {
          setError('AdminProductTypes.notFound');
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setIsLoading(false);
      }
    },
    [dependencies.services.productType],
  );

  return (
    <DeleteModalContainer
      getErrorMessageID={getErrorMessageID}
      deleteEntity={deleteEntity}
      preloadData={preloadData}
      getBackPath={({ forever }) => `/admin/productTypes${buildSearchString({ deleted: Boolean(forever).toString() })}`}
    />
  );
};
