import React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminCharacteristicsEditPresenter } from '@eye8/admin/pages/characteristics/edit/presenter';
import { AdminCharacteristicsEditView } from '@eye8/admin/pages/characteristics/edit/view';
import { useAdminCharacteristicsState } from '@eye8/admin/state/characteristics';
import { useDependencies } from '@eye8/di';

export const AdminCharacteristicsEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { state: adminCharacteristicsState } = useAdminCharacteristicsState();

  return (
    <AdminCharacteristicsEditPresenter
      characteristicId={parseInt(params.id, 10)}
      history={history}
      View={AdminCharacteristicsEditView}
      service={dependencies.services.characteristic}
      adminCharacteristicsState={adminCharacteristicsState}
    />
  );
};
