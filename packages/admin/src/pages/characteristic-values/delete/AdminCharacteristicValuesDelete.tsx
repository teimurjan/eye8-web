import React from 'react';

import { useDI } from '@eye8/di';

import { DeleteModal } from '../../../components';
import { useAdminCharacteristicValuesState } from '../../../state';

const AdminCharacteristicValuesDelete = () => {
  const { di } = useDI();
  const { remove: deleteCharacteristicValue } = useAdminCharacteristicValuesState();

  return (
    <DeleteModal
      deleteEntity={async ({ id }) => {
        await di.service.category.delete(id);
        deleteCharacteristicValue(id);
      }}
      checkExistence={({ id }) => di.service.characteristicValue.exists(id)}
      getBackPath={() => '/admin/characteristicValues'}
    />
  );
};

export default AdminCharacteristicValuesDelete;
