import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router';

import { AdminFeatureTypesCreateContainer } from 'src/components/Admin/FeatureTypes/Create/AdminFeatureTypesCreateContainer';
import { AdminFeatureTypesDeleteContainer } from 'src/components/Admin/FeatureTypes/Delete/AdminFeatureTypesDeleteContainer';
import { AdminFeatureTypesEditContainer } from 'src/components/Admin/FeatureTypes/Edit/AdminFeatureTypesEditContainer';
import { AdminFeatureTypesListContainer } from 'src/components/Admin/FeatureTypes/List/AdminFeatureTypesListContainer';

export const AdminFeatureTypes = ({ match }: RouteComponentProps<any>) => (
  <>
    <AdminFeatureTypesListContainer />

    <Route path={`${match.path}/new`} component={AdminFeatureTypesCreateContainer} />
    <Route path={`${match.path}/delete/:id`} component={AdminFeatureTypesDeleteContainer} />
    <Route path={`${match.path}/edit/:id`} component={AdminFeatureTypesEditContainer} />
  </>
);
