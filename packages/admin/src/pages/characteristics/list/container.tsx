import React from 'react';

import { AdminCharacteristicsListPresenter } from '@eye8/admin/pages/characteristics/list/presenter';
import { AdminCharacteristicsListView } from '@eye8/admin/pages/characteristics/list/view';
import { useAdminCharacteristicsState } from '@eye8/admin/state/characteristics';

export const AdminCharacteristicsListContainer = () => {
  const { state: adminCharacteristicsState } = useAdminCharacteristicsState();

  return (
    <AdminCharacteristicsListPresenter
      View={AdminCharacteristicsListView}
      adminCharacteristicsState={adminCharacteristicsState}
    />
  );
};
