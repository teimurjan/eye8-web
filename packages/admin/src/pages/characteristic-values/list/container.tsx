import React from 'react';

import { AdminCharacteristicValuesListPresenter } from '@eye8/admin/pages/characteristic-values/list/presenter';
import { AdminCharacteristicValuesListView } from '@eye8/admin/pages/characteristic-values/list/view';
import { useAdminCharacteristicValuesState } from '@eye8/admin/state/characteristic-values';

export const AdminCharacteristicValuesListContainer = () => {
  const { state: adminCharacteristicValuesState } = useAdminCharacteristicValuesState();

  return (
    <AdminCharacteristicValuesListPresenter
      View={AdminCharacteristicValuesListView}
      adminCharacteristicValuesState={adminCharacteristicValuesState}
    />
  );
};
