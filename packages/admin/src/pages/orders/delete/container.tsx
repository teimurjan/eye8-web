import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminOrdersState } from '@eye8/admin/state/orders';
import { useDI } from '@eye8/di';

export const AdminOrdersDeleteContainer = () => {
  const { di } = useDI();
  const {
    state: { remove: deleteOrder },
  } = useAdminOrdersState();

  return (
    <DeleteModalContainer
      deleteEntity={async ({ id }) => {
        await di.service.order.delete(id);
        deleteOrder(id);
      }}
      checkExistence={({ id }) => di.service.order.exists(id)}
      getBackPath={() => '/admin/orders'}
    />
  );
};
