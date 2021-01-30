import React from 'react';

import { AdminRatesCreateContainer } from '@eye8/admin/pages/rates/create/container';
import { AdminRatesDeleteContainer } from '@eye8/admin/pages/rates/delete/container';
import { AdminRatesListContainer } from '@eye8/admin/pages/rates/list/container';

import { Page } from '../../components';

export const AdminRates = () => (
  <Page
    ListComponent={AdminRatesListContainer}
    CreateComponent={AdminRatesCreateContainer}
    EditComponent={() => null}
    DeleteComponent={AdminRatesDeleteContainer}
  />
);
