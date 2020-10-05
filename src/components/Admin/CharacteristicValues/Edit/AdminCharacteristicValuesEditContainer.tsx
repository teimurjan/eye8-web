import * as React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminCharacteristicValuesEditPresenter } from 'src/components/Admin/CharacteristicValues/Edit/AdminCharacteristicValuesEditPresenter';
import { AdminCharacteristicValuesEditView } from 'src/components/Admin/CharacteristicValues/Edit/AdminCharacteristicValuesEditView';
import { useDependencies } from 'src/DI/DI';
import { useAdminCharacteristicsState } from 'src/state/AdminCharacteristicsState';
import { useAdminCharacteristicValuesState } from 'src/state/AdminCharacteristicValuesState';
import { useIntlState } from 'src/state/IntlState';

export const AdminCharacteristicValuesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { state: adminCharacteristicsState } = useAdminCharacteristicsState();
  const { state: adminCharacteristicValuesState } = useAdminCharacteristicValuesState();
  const { intlState } = useIntlState();

  return (
    <AdminCharacteristicValuesEditPresenter
      characteristicValueId={parseInt(params.id, 10)}
      history={history}
      View={AdminCharacteristicValuesEditView}
      service={dependencies.services.characteristicValue}
      intlState={intlState}
      adminCharacteristicsState={adminCharacteristicsState}
      adminCharacteristicValuesState={adminCharacteristicValuesState}
    />
  );
};
