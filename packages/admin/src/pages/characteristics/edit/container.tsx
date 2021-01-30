import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminCharacteristicsEditPresenter } from '@eye8/admin/pages/characteristics/edit/presenter';
import { AdminCharacteristicsEditView } from '@eye8/admin/pages/characteristics/edit/view';
import { useDI } from '@eye8/di';

import { useAdminCharacteristicsState } from '../../../state';

export const AdminCharacteristicsEditContainer = () => {
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
      adminCharacteristicsState={adminCharacteristicsState}
    />
  );
};
