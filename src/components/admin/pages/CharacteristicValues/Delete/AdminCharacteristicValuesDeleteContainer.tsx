import * as React from 'react';

import { DeleteModalContainer } from 'src/components/admin/table/DeleteModal/DeleteModalContainer';
import { useDependencies } from 'src/DI/DI';
import { useAdminCharacteristicValuesState } from 'src/state/Admin/AdminCharacteristicValuesState';

export const AdminCharacteristicValuesDeleteContainer = () => {
  const { dependencies } = useDependencies();
  const {
    state: { remove: deleteCharacteristicValue },
  } = useAdminCharacteristicValuesState();

  return (
    <DeleteModalContainer
      deleteEntity={async ({ id }) => {
        await dependencies.services.category.delete(id);
        deleteCharacteristicValue(id);
      }}
      checkExistence={({ id }) => dependencies.services.characteristicValue.exists(id)}
      getBackPath={() => '/admin/characteristicValues'}
    />
  );
};
