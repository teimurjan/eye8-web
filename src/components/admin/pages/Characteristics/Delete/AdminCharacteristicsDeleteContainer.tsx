import * as React from 'react';

import { DeleteModalContainer } from 'src/components/admin/table/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import { useAdminCharacteristicsState } from 'src/state/Admin/AdminCharacteristicsState';

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
