import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminCharacteristicValuesEditPresenter } from '@eye8/admin/pages/characteristic-values/edit/presenter';
import { AdminCharacteristicValuesEditView } from '@eye8/admin/pages/characteristic-values/edit/view';
import { useDI } from '@eye8/di';

import { useAdminCharacteristicValuesState } from '../../../state';
import { useAdminCharacteristicsState } from '../../../state';

export const AdminCharacteristicValuesEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { di } = useDI();
  const adminCharacteristicsState = useAdminCharacteristicsState();
  const adminCharacteristicValuesState = useAdminCharacteristicValuesState();

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
