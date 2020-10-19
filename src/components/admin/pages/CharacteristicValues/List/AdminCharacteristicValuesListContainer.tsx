import * as React from 'react';

import { AdminCharacteristicValuesListPresenter } from 'src/components/admin/pages/CharacteristicValues/List/AdminCharacteristicValuesListPresenter';
import { AdminCharacteristicValuesListView } from 'src/components/admin/pages/CharacteristicValues/List/AdminCharacteristicValuesListView';
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
