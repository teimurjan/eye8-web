import React from 'react';

import { Page } from '../../components';

import AdminCharacteristicsCreate from './create';
import AdminCharacteristicsDelete from './delete';
import AdminCharacteristicsEdit from './edit';
import AdminCharacteristicsList from './list';

const AdminCharacteristics = () => (
  <Page
    ListComponent={AdminCharacteristicsList}
    CreateComponent={AdminCharacteristicsCreate}
    EditComponent={AdminCharacteristicsEdit}
    DeleteComponent={AdminCharacteristicsDelete}
  />
);

export default AdminCharacteristics;
