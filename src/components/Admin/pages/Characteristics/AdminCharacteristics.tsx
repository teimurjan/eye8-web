import * as React from 'react';

import { AdminPage } from 'src/components/admin/AdminPage/AdminPage';
import { AdminCharacteristicsCreateContainer } from 'src/components/admin/pages/Characteristics/Create/AdminCharacteristicsCreateContainer';
import { AdminCharacteristicsDeleteContainer } from 'src/components/admin/pages/Characteristics/Delete/AdminCharacteristicsDeleteContainer';
import { AdminCharacteristicsEditContainer } from 'src/components/admin/pages/Characteristics/Edit/AdminCharacteristicsEditContainer';
import { AdminCharacteristicsListContainer } from 'src/components/admin/pages/Characteristics/List/AdminCharacteristicsListContainer';

export const AdminCharacteristics = () => (
  <AdminPage
    ListComponent={AdminCharacteristicsListContainer}
    CreateComponent={AdminCharacteristicsCreateContainer}
    EditComponent={AdminCharacteristicsEditContainer}
    DeleteComponent={AdminCharacteristicsDeleteContainer}
  />
);
