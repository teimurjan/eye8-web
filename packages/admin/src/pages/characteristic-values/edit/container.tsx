import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminCharacteristicValuesEditPresenter } from '@eye8/admin/pages/characteristic-values/edit/presenter';
import { AdminCharacteristicValuesEditView } from '@eye8/admin/pages/characteristic-values/edit/view';
import { useAdminCharacteristicValuesState } from '@eye8/admin/state/characteristic-values';
import { useAdminCharacteristicsState } from '@eye8/admin/state/characteristics';
import { useDI } from '@eye8/di';

export const AdminCharacteristicValuesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { di } = useDI();
  const { state: adminCharacteristicsState } = useAdminCharacteristicsState();
  const { state: adminCharacteristicValuesState } = useAdminCharacteristicValuesState();

  return (
    <AdminCharacteristicValuesEditPresenter
      characteristicValueId={parseInt(params.id, 10)}
      history={history}
      View={AdminCharacteristicValuesEditView}
      service={di.service.characteristicValue}
      adminCharacteristicsState={adminCharacteristicsState}
      adminCharacteristicValuesState={adminCharacteristicValuesState}
    />
  );
};
