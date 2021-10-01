import React from 'react';

import { useDI } from '@eye8/di';
import { buildSearchString } from '@eye8/shared/utils';

import { DeleteModal } from '../../../components';
import { useAdminOrdersFilters } from '../../../hooks';
import { useAdminOrdersState } from '../../../state';

const AdminOrdersDelete = () => {
  const { di } = useDI();
  const { remove: deleteOrder } = useAdminOrdersState();
  const {
    filters: { deleted },
  } = useAdminOrdersFilters();

  return (
    <DeleteModal
      deleteEntity={async ({ id }) => {
        await di.service.order.delete(id, deleted);
        deleteOrder(id);
      }}
      checkExistence={({ id }) => di.service.order.exists(id, deleted)}
      getBackPath={() => `/admin/orders${buildSearchString({ deleted })}`}
    />
  );
};

export default AdminOrdersDelete;
