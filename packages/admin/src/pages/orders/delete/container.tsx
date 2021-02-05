import React from 'react';

import { useDI } from '@eye8/di';

import { DeleteModal } from '../../../components';
import { useAdminOrdersState } from '../../../state';

const AdminOrdersDeleteContainer = () => {
  const { di } = useDI();
  const { remove: deleteOrder } = useAdminOrdersState();

  return (
    <DeleteModal
      deleteEntity={async ({ id }) => {
        await di.service.order.delete(id);
        deleteOrder(id);
      }}
      checkExistence={({ id }) => di.service.order.exists(id)}
      getBackPath={() => '/admin/orders'}
    />
  );
};

export default AdminOrdersDeleteContainer;
