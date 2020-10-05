import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';

import { AdminCharacteristicsCreateContainer } from 'src/components/Admin/Characteristics/Create/AdminCharacteristicsCreateContainer';
import { AdminCharacteristicsDeleteContainer } from 'src/components/Admin/Characteristics/Delete/AdminCharacteristicsDeleteContainer';
import { AdminCharacteristicsEditContainer } from 'src/components/Admin/Characteristics/Edit/AdminCharacteristicsEditContainer';
import { AdminCharacteristicsListContainer } from 'src/components/Admin/Characteristics/List/AdminCharacteristicsListContainer';

export const AdminCharacteristics = ({ match }: RouteComponentProps<any>) => (
  <>
    <AdminCharacteristicsListContainer />

    <Route path={`${match.path}/new`} component={AdminCharacteristicsCreateContainer} />
    <Route path={`${match.path}/delete/:id`} component={AdminCharacteristicsDeleteContainer} />
    <Route path={`${match.path}/edit/:id`} component={AdminCharacteristicsEditContainer} />
  </>
);
