import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminCharacteristicValuesState } from '@eye8/admin/state/characteristic-values';
import { useDependencies } from '@eye8/di';

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
