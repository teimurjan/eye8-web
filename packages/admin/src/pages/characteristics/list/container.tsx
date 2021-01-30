import React from 'react';

import { AdminCharacteristicsListPresenter } from '@eye8/admin/pages/characteristics/list/presenter';
import { AdminCharacteristicsListView } from '@eye8/admin/pages/characteristics/list/view';

import { useAdminCharacteristicsState } from '../../../state';

export const AdminCharacteristicsListContainer = () => {
  const adminCharacteristicsState = useAdminCharacteristicsState();

  return (
    <AdminCharacteristicsListPresenter
      View={AdminCharacteristicsListView}
      adminCharacteristicsState={adminCharacteristicsState}
    />
  );
};
