import * as React from 'react';

import { AdminCharacteristicValuesListPresenter } from 'src/components/Admin/CharacteristicValues/List/AdminCharacteristicValuesListPresenter';
import { AdminCharacteristicValuesListView } from 'src/components/Admin/CharacteristicValues/List/AdminCharacteristicValuesListView';
import { useAdminCharacteristicValuesState } from 'src/state/Admin/AdminCharacteristicValuesState';

export const AdminCharacteristicValuesListContainer = () => {
  const { state: adminCharacteristicValuesState } = useAdminCharacteristicValuesState();

  return (
    <AdminCharacteristicValuesListPresenter
      View={AdminCharacteristicValuesListView}
      adminCharacteristicValuesState={adminCharacteristicValuesState}
    />
  );
};
