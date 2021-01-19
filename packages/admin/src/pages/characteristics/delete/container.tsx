import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminCharacteristicsState } from '@eye8/admin/state/characteristics';
import { useDI } from '@eye8/di';

export const AdminCharacteristicsDeleteContainer = () => {
  const { di } = useDI();
  const {
    state: { remove: deleteCharacteristic },
  } = useAdminCharacteristicsState();

  return (
    <DeleteModalContainer
      deleteEntity={async ({ id }) => {
        await di.service.category.delete(id);
        deleteCharacteristic(id);
      }}
      checkExistence={({ id }) => di.service.characteristic.exists(id)}
      getBackPath={() => '/admin/characteristics'}
    />
  );
};
