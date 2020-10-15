import * as React from 'react';

import { AdminCharacteristicsListPresenter } from 'src/components/Admin/Characteristics/List/AdminCharacteristicsListPresenter';
import { AdminCharacteristicsListView } from 'src/components/Admin/Characteristics/List/AdminCharacteristicsListView';
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
