import * as React from 'react';

import { DeleteModalContainer } from 'src/components/Admin/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import { useAdminProductsState } from 'src/state/AdminProductsState';

export const AdminProductsDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    state: { remove: deleteProduct },
  } = useAdminProductsState();

  const deleteEntity = React.useCallback(
    async (id: number) => {
      await dependencies.services.product.delete(id);
      deleteProduct(id);
    },
    [deleteProduct, dependencies.services.product],
  );

  const preloadData = React.useCallback(
    async ({ id, setError, setIsLoading }) => {
      try {
        setIsLoading(true);
        const isExists = await dependencies.services.product.exists(id);
        if (!isExists) {
          setError('AdminProducts.notFound');
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setIsLoading(false);
      }
    },
    [dependencies.services.product],
  );

  return <DeleteModalContainer deleteEntity={deleteEntity} preloadData={preloadData} backPath="/admin/products" />;
};
