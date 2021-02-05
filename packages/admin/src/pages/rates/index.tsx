import React from 'react';

import { Page } from '../../components';

import AdminRatesCreate from './create';
import AdminRatesDelete from './delete';
import AdminRatesList from './list';

const AdminRates = () => (
  <Page
    ListComponent={AdminRatesList}
    CreateComponent={AdminRatesCreate}
    EditComponent={() => null}
    DeleteComponent={AdminRatesDelete}
  />
);

export default AdminRates;
