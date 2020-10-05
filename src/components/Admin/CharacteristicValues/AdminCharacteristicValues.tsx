import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';

import { AdminCharacteristicValuesCreateContainer } from 'src/components/Admin/CharacteristicValues/Create/AdminCharacteristicValuesCreateContainer';
import { AdminCharacteristicValuesDeleteContainer } from 'src/components/Admin/CharacteristicValues/Delete/AdminCharacteristicValuesDeleteContainer';
import { AdminCharacteristicValuesEditContainer } from 'src/components/Admin/CharacteristicValues/Edit/AdminCharacteristicValuesEditContainer';
import { AdminCharacteristicValuesListContainer } from 'src/components/Admin/CharacteristicValues/List/AdminCharacteristicValuesListContainer';

export const AdminCharacteristicValues = ({ match }: RouteComponentProps<any>) => (
  <>
    <AdminCharacteristicValuesListContainer />

    <Route path={`${match.path}/new`} component={AdminCharacteristicValuesCreateContainer} />
    <Route path={`${match.path}/delete/:id`} component={AdminCharacteristicValuesDeleteContainer} />
    <Route path={`${match.path}/edit/:id`} component={AdminCharacteristicValuesEditContainer} />
  </>
);
