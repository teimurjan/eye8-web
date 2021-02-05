import React from 'react';

import { Page } from '../../components';

import AdminFeatureTypesCreate from './create';
import AdminFeatureTypesDelete from './delete';
import AdminFeatureTypesEdit from './edit';
import AdminFeatureTypesList from './list';

const AdminFeatureTypes = () => (
  <Page
    ListComponent={AdminFeatureTypesList}
    CreateComponent={AdminFeatureTypesCreate}
    EditComponent={AdminFeatureTypesEdit}
    DeleteComponent={AdminFeatureTypesDelete}
  />
);

export default AdminFeatureTypes;
export { NewFeatureTypeButton } from './list'