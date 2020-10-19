import * as React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminCharacteristicValuesEditPresenter } from 'src/components/admin/pages/CharacteristicValues/Edit/AdminCharacteristicValuesEditPresenter';
import { AdminCharacteristicValuesEditView } from 'src/components/admin/pages/CharacteristicValues/Edit/AdminCharacteristicValuesEditView';
import { useDependencies } from 'src/DI/DI';
import { useAdminCharacteristicsState } from 'src/state/Admin/AdminCharacteristicsState';
import { useAdminCharacteristicValuesState } from 'src/state/Admin/AdminCharacteristicValuesState';

export const AdminCharacteristicValuesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { state: adminCharacteristicsState } = useAdminCharacteristicsState();
  const { state: adminCharacteristicValuesState } = useAdminCharacteristicValuesState();

  return (
    <AdminCharacteristicValuesEditPresenter
      characteristicValueId={parseInt(params.id, 10)}
      history={history}
      View={AdminCharacteristicValuesEditView}
      service={dependencies.services.characteristicValue}
      adminCharacteristicsState={adminCharacteristicsState}
      adminCharacteristicValuesState={adminCharacteristicValuesState}
    />
  );
};
