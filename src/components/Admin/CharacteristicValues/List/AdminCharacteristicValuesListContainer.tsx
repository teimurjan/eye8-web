import * as React from 'react';

import { AdminCharacteristicValuesListPresenter } from 'src/components/Admin/CharacteristicValues/List/AdminCharacteristicValuesListPresenter';
import { AdminCharacteristicValuesListView } from 'src/components/Admin/CharacteristicValues/List/AdminCharacteristicValuesListView';
import { useAdminCharacteristicValuesState } from 'src/state/AdminCharacteristicValuesState';
import { useIntlState } from 'src/state/IntlState';

export const AdminCharacteristicValuesListContainer = () => {
  const { intlState } = useIntlState();
  const { state: adminCharacteristicValuesState } = useAdminCharacteristicValuesState();

  return (
    <AdminCharacteristicValuesListPresenter
      View={AdminCharacteristicValuesListView}
      adminCharacteristicValuesState={adminCharacteristicValuesState}
      intlState={intlState}
    />
  );
};
