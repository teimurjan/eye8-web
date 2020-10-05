import * as React from 'react';
import { useHistory } from 'react-router';

import { AdminCharacteristicsCreatePresenter } from 'src/components/Admin/Characteristics/Create/AdminCharacteristicsCreatePresenter';
import { AdminCharacteristicsCreateView } from 'src/components/Admin/Characteristics/Create/AdminCharacteristicsCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminCharacteristicsState } from 'src/state/AdminCharacteristicsState';
import { useIntlState } from 'src/state/IntlState';

export const AdminCharacteristicsCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { state: adminCharacteristicsState } = useAdminCharacteristicsState();
  const { intlState } = useIntlState();

  return (
    <AdminCharacteristicsCreatePresenter
      history={history}
      View={AdminCharacteristicsCreateView}
      service={dependencies.services.characteristic}
      intlState={intlState}
      adminCharacteristicsState={adminCharacteristicsState}
    />
  );
};
