import React from 'react';

import { AdminFeatureValuesCreateContainer } from '@eye8/admin/pages/feature-values/create/container';
import { AdminFeatureValuesDeleteContainer } from '@eye8/admin/pages/feature-values/delete/container';
import { AdminFeatureValuesEditContainer } from '@eye8/admin/pages/feature-values/edit/container';
import { AdminFeatureValuesListContainer } from '@eye8/admin/pages/feature-values/list/container';

import { Page } from '../../components';

export const AdminFeatureValues = () => (
  <Page
    ListComponent={AdminFeatureValuesListContainer}
    CreateComponent={AdminFeatureValuesCreateContainer}
    EditComponent={AdminFeatureValuesEditContainer}
    DeleteComponent={AdminFeatureValuesDeleteContainer}
  />
);
