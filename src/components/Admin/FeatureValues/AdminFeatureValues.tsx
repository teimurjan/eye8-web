import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';

import { AdminFeatureValuesCreateContainer } from 'src/components/Admin/FeatureValues/Create/AdminFeatureValuesCreateContainer';
import { AdminFeatureValuesDeleteContainer } from 'src/components/Admin/FeatureValues/Delete/AdminFeatureValuesDeleteContainer';
import { AdminFeatureValuesEditContainer } from 'src/components/Admin/FeatureValues/Edit/AdminFeatureValuesEditContainer';
import { AdminFeatureValuesListContainer } from 'src/components/Admin/FeatureValues/List/AdminFeatureValuesListContainer';

export const AdminFeatureValues = ({ match }: RouteComponentProps<any>) => (
  <>
    <AdminFeatureValuesListContainer />

    <Route path={`${match.path}/new`} component={AdminFeatureValuesCreateContainer} />
    <Route path={`${match.path}/delete/:id`} component={AdminFeatureValuesDeleteContainer} />
    <Route path={`${match.path}/edit/:id`} component={AdminFeatureValuesEditContainer} />
  </>
);
