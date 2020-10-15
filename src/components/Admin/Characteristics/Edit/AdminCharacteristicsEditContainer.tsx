import * as React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminCharacteristicsEditPresenter } from 'src/components/Admin/Characteristics/Edit/AdminCharacteristicsEditPresenter';
import { AdminCharacteristicsEditView } from 'src/components/Admin/Characteristics/Edit/AdminCharacteristicsEditView';
import { useDependencies } from 'src/DI/DI';
import { useAdminCharacteristicsState } from 'src/state/Admin/AdminCharacteristicsState';

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
