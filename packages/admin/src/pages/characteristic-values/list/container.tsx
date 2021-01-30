import React from 'react';

import { AdminCharacteristicValuesListPresenter } from '@eye8/admin/pages/characteristic-values/list/presenter';
import { AdminCharacteristicValuesListView } from '@eye8/admin/pages/characteristic-values/list/view';

import { useAdminCharacteristicValuesState } from '../../../state';

export const AdminCharacteristicValuesListContainer = () => {
  const adminCharacteristicValuesState = useAdminCharacteristicValuesState();

  return (
    <AdminCharacteristicValuesListPresenter
      View={AdminCharacteristicValuesListView}
      adminCharacteristicValuesState={adminCharacteristicValuesState}
    />
  );
};
