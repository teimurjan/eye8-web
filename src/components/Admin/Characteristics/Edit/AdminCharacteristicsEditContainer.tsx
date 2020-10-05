import * as React from 'react';
import { useHistory, useParams } from 'react-router';

import { AdminCharacteristicsEditPresenter } from 'src/components/Admin/Characteristics/Edit/AdminCharacteristicsEditPresenter';
import { AdminCharacteristicsEditView } from 'src/components/Admin/Characteristics/Edit/AdminCharacteristicsEditView';
import { useDependencies } from 'src/DI/DI';
import { useAdminCharacteristicsState } from 'src/state/AdminCharacteristicsState';
import { useIntlState } from 'src/state/IntlState';

export const AdminCharacteristicsEditContainer = () => {
  const history = useHistory();
  const params = useParams<{ id: string }>();

  const { dependencies } = useDependencies();
  const { state: adminCharacteristicsState } = useAdminCharacteristicsState();
  const { intlState } = useIntlState();

  return (
    <AdminCharacteristicsEditPresenter
      characteristicId={parseInt(params.id, 10)}
      history={history}
      View={AdminCharacteristicsEditView}
      service={dependencies.services.characteristic}
      intlState={intlState}
      adminCharacteristicsState={adminCharacteristicsState}
    />
  );
};
