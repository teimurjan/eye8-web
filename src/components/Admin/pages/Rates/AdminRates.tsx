import * as React from 'react';

import { AdminPage } from 'src/components/admin/pages/AdminPage';
import { AdminRatesCreateContainer } from 'src/components/admin/pages/Rates/Create/AdminRatesCreateContainer';
import { AdminRatesDeleteContainer } from 'src/components/admin/pages/Rates/Delete/AdminRatesDeleteContainer';
import { AdminRatesListContainer } from 'src/components/admin/pages/Rates/List/AdminRatesListContainer';

export const AdminRates = () => (
  <AdminPage
    ListComponent={AdminRatesListContainer}
    CreateComponent={AdminRatesCreateContainer}
    EditComponent={() => null}
    DeleteComponent={AdminRatesDeleteContainer}
  />
);
