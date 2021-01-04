import React from 'react';

import { AdminPage } from '@eye8/admin/components/page';
import { AdminRatesCreateContainer } from '@eye8/admin/pages/rates/create/container';
import { AdminRatesDeleteContainer } from '@eye8/admin/pages/rates/delete/container';
import { AdminRatesListContainer } from '@eye8/admin/pages/rates/list/container';

export const AdminRates = () => (
  <AdminPage
    ListComponent={AdminRatesListContainer}
    CreateComponent={AdminRatesCreateContainer}
    EditComponent={() => null}
    DeleteComponent={AdminRatesDeleteContainer}
  />
);
