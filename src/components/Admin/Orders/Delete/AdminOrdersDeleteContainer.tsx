import * as React from 'react';

import { DeleteModalContainer } from 'src/components/Admin/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import { useAdminOrdersState } from 'src/state/AdminOrdersState';

export const AdminOrdersDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    adminOrdersState: { getOrders, deleteOrder },
  } = useAdminOrdersState();

  const deleteEntity = React.useCallback(
    async (id: number) => {
      await dependencies.services.order.delete(id);
      deleteOrder(id);
      getOrders();
    },
    [deleteOrder, dependencies.services.order, getOrders],
  );

  const preloadData = React.useCallback(
    async ({ id, setError, setIsLoading }) => {
      try {
        setIsLoading(true);
        const isExists = await dependencies.services.order.exists(id);
        if (!isExists) {
          setError('AdminOrders.notFound');
        }
      } catch (e) {
        setError('errors.common');
      } finally {
        setIsLoading(false);
      }
    },
    [dependencies.services.order],
  );

  return <DeleteModalContainer deleteEntity={deleteEntity} preloadData={preloadData} backPath="/admin/orders" />;
};
