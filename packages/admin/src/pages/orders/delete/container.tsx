import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminOrdersState } from '@eye8/admin/state/orders';
import { useDependencies } from '@eye8/di';

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
