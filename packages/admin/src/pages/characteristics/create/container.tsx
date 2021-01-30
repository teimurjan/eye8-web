import React from 'react';
import { useHistory } from 'react-router';

import { AdminCharacteristicsCreatePresenter } from '@eye8/admin/pages/characteristics/create/presenter';
import { AdminCharacteristicsCreateView } from '@eye8/admin/pages/characteristics/create/view';
import { useDI } from '@eye8/di';

import { useAdminCharacteristicsState } from '../../../state';

export const AdminCharacteristicsCreateContainer = () => {
  const history = useHistory();

  const { di } = useDI();
  const adminCharacteristicsState = useAdminCharacteristicsState();

  return (
    <AdminCharacteristicsCreatePresenter
      history={history}
      View={AdminCharacteristicsCreateView}
      service={di.service.characteristic}
      adminCharacteristicsState={adminCharacteristicsState}
    />
  );
};
