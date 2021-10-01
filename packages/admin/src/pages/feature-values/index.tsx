import React from 'react';

import { Page } from '../../components';

import AdminFeatureValuesCreate from './create';
import AdminFeatureValuesDelete from './delete';
import AdminFeatureValuesEdit from './edit';
import AdminFeatureValuesList from './list';

const AdminFeatureValues = () => (
  <Page
    ListComponent={AdminFeatureValuesList}
    CreateComponent={AdminFeatureValuesCreate}
    EditComponent={AdminFeatureValuesEdit}
    DeleteComponent={AdminFeatureValuesDelete}
  />
);

export default AdminFeatureValues;