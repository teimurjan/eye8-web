import React from 'react';

import { useAdminCharacteristicValuesState } from '../../../state';

import AdminCharacteristicValuesListPresenter from './presenter';
import AdminCharacteristicValuesListView from './view';


const AdminCharacteristicValuesListContainer = () => {
  const adminCharacteristicValuesState = useAdminCharacteristicValuesState();

  return (
    <AdminCharacteristicValuesListPresenter
      View={AdminCharacteristicValuesListView}
      adminCharacteristicValuesState={adminCharacteristicValuesState}
    />
  );
};

export default AdminCharacteristicValuesListContainer;
