import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminCharacteristicsState } from '@eye8/admin/state/characteristics';
import { useDependencies } from '@eye8/di';

export const AdminCharacteristicsDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    state: { remove: deleteCharacteristic },
  } = useAdminCharacteristicsState();

  return (
    <DeleteModalContainer
      deleteEntity={async ({ id }) => {
        await dependencies.services.category.delete(id);
        deleteCharacteristic(id);
      }}
      checkExistence={({ id }) => dependencies.services.characteristic.exists(id)}
      getBackPath={() => '/admin/characteristics'}
    />
  );
};
