import * as React from 'react';

import { AdminCharacteristicsListPresenter } from 'src/components/admin/pages/Characteristics/List/AdminCharacteristicsListPresenter';
import { AdminCharacteristicsListView } from 'src/components/admin/pages/Characteristics/List/AdminCharacteristicsListView';
import { useAdminCharacteristicsState } from 'src/state/Admin/AdminCharacteristicsState';

export const AdminCharacteristicsListContainer = () => {
  const { state: adminCharacteristicsState } = useAdminCharacteristicsState();

  return (
    <AdminCharacteristicsListPresenter
      View={AdminCharacteristicsListView}
      adminCharacteristicsState={adminCharacteristicsState}
    />
  );
};
