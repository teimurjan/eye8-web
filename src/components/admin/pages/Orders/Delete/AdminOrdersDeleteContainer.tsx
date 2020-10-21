import * as React from 'react';

import { DeleteModalContainer } from 'src/components/admin/table/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import { useAdminOrdersState } from 'src/state/Admin/AdminOrdersState';

export const AdminOrdersDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    state: { remove: deleteOrder },
  } = useAdminOrdersState();

  return (
    <DeleteModalContainer
      deleteEntity={async ({ id }) => {
        await dependencies.services.order.delete(id);
        deleteOrder(id);
      }}
      checkExistence={({ id }) => dependencies.services.order.exists(id)}
      getBackPath={() => '/admin/orders'}
    />
  );
};
