import React from 'react';
import { useHistory, useParams } from 'react-router';

import { useDI } from '@eye8/di';

import { useAdminCharacteristicValuesState, useAdminCharacteristicsState } from '../../../state';

import AdminCharacteristicValuesEditPresenter from './presenter';
import AdminCharacteristicValuesEditView from './view';

const AdminCharacteristicValuesEditContainer = () => {
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

export default AdminCharacteristicValuesEditContainer;
