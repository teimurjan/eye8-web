import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';

import { AdminRatesCreateContainer } from 'src/components/Admin/Rates/Create/AdminRatesCreateContainer';
import { AdminRatesDeleteContainer } from 'src/components/Admin/Rates/Delete/AdminRatesDeleteContainer';
import { AdminRatesListContainer } from 'src/components/Admin/Rates/List/AdminRatesListContainer';

export const AdminRates = ({ match }: RouteComponentProps) => (
  <>
    <AdminRatesListContainer />
    <Route path={`${match.path}/new`} component={AdminRatesCreateContainer} />
    <Route path={`${match.path}/delete/:id`} component={AdminRatesDeleteContainer} />
  </>
);
