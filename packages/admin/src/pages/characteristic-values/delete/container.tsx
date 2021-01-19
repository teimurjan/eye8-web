import React from 'react';

import { DeleteModalContainer } from '@eye8/admin/components/delete-modal/container';
import { useAdminCharacteristicValuesState } from '@eye8/admin/state/characteristic-values';
import { useDI } from '@eye8/di';

export const AdminCharacteristicValuesDeleteContainer = () => {
  const { di } = useDI();
  const {
    state: { remove: deleteCharacteristicValue },
  } = useAdminCharacteristicValuesState();

  return (
    <DeleteModalContainer
      deleteEntity={async ({ id }) => {
        await di.service.category.delete(id);
        deleteCharacteristicValue(id);
      }}
      checkExistence={({ id }) => di.service.characteristicValue.exists(id)}
      getBackPath={() => '/admin/characteristicValues'}
    />
  );
};
