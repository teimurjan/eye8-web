import React from 'react';

import { useDI } from '@eye8/di';

import { DeleteModal } from '../../../components';
import { useAdminCharacteristicsState } from '../../../state';

const AdminCharacteristicsDeleteContainer = () => {
  const { di } = useDI();
  const { remove: deleteCharacteristic } = useAdminCharacteristicsState();

  return (
    <DeleteModal
      deleteEntity={async ({ id }) => {
        await di.service.category.delete(id);
        deleteCharacteristic(id);
      }}
      checkExistence={({ id }) => di.service.characteristic.exists(id)}
      getBackPath={() => '/admin/characteristics'}
    />
  );
};

export default AdminCharacteristicsDeleteContainer;
