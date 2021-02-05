import React from 'react';

import { Page } from '../../components';

import AdminCharacteristicValuesCreate from './create';
import AdminCharacteristicValuesDelete from './delete';
import AdminCharacteristicValuesEdit from './edit';
import AdminCharacteristicValuesList from './list';

const AdminCharacteristicValues = () => (
  <Page
    ListComponent={AdminCharacteristicValuesList}
    CreateComponent={AdminCharacteristicValuesCreate}
    EditComponent={AdminCharacteristicValuesEdit}
    DeleteComponent={AdminCharacteristicValuesDelete}
  />
);

export default AdminCharacteristicValues;
