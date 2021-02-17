import React from 'react';
import { useHistory, useParams } from 'react-router';

import { useDI } from '@eye8/di';

import { useAdminCharacteristicsState } from '../../../state';

import AdminCharacteristicsEditPresenter from './presenter';
import AdminCharacteristicsEditView from './view';

const AdminCharacteristicsEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { di } = useDI();
  const adminCharacteristicsState = useAdminCharacteristicsState();

  return (
    <AdminCharacteristicsEditPresenter
      characteristicId={parseInt(params.id, 10)}
      history={history}
      View={AdminCharacteristicsEditView}
      service={di.service.characteristic}
      characteristicValueService={di.service.characteristicValue}
      adminCharacteristicsState={adminCharacteristicsState}
    />
  );
};

export default AdminCharacteristicsEditContainer;
