import React from 'react';

import { AdminFeatureTypesCreateContainer } from '@eye8/admin/pages/feature-types/create/container';
import { AdminFeatureTypesDeleteContainer } from '@eye8/admin/pages/feature-types/delete/container';
import { AdminFeatureTypesEditContainer } from '@eye8/admin/pages/feature-types/edit/container';
import { AdminFeatureTypesListContainer } from '@eye8/admin/pages/feature-types/list/container';

import { Page } from '../../components';

export const AdminFeatureTypes = () => (
  <Page
    ListComponent={AdminFeatureTypesListContainer}
    CreateComponent={AdminFeatureTypesCreateContainer}
    EditComponent={AdminFeatureTypesEditContainer}
    DeleteComponent={AdminFeatureTypesDeleteContainer}
  />
);
