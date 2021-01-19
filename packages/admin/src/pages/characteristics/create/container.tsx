import React from 'react';
import { useHistory } from 'react-router';

import { AdminCharacteristicsCreatePresenter } from '@eye8/admin/pages/characteristics/create/presenter';
import { AdminCharacteristicsCreateView } from '@eye8/admin/pages/characteristics/create/view';
import { useAdminCharacteristicsState } from '@eye8/admin/state/characteristics';
import { useDI } from '@eye8/di';

export const AdminCharacteristicsCreateContainer = () => {
  const history = useHistory();

  const { di } = useDI();
  const { state: adminCharacteristicsState } = useAdminCharacteristicsState();

  return (
    <AdminCharacteristicsCreatePresenter
      history={history}
      View={AdminCharacteristicsCreateView}
      service={di.service.characteristic}
      adminCharacteristicsState={adminCharacteristicsState}
    />
  );
};
