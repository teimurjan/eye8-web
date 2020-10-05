import * as React from 'react';

import { AdminCharacteristicsListPresenter } from 'src/components/Admin/Characteristics/List/AdminCharacteristicsListPresenter';
import { AdminCharacteristicsListView } from 'src/components/Admin/Characteristics/List/AdminCharacteristicsListView';
import { useAdminCharacteristicsState } from 'src/state/AdminCharacteristicsState';
import { useIntlState } from 'src/state/IntlState';

export const AdminCharacteristicsListContainer = () => {
  const { state: adminCharacteristicsState } = useAdminCharacteristicsState();
  const { intlState } = useIntlState();

  return (
    <AdminCharacteristicsListPresenter
      View={AdminCharacteristicsListView}
      adminCharacteristicsState={adminCharacteristicsState}
      intlState={intlState}
    />
  );
};
