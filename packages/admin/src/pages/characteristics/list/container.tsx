import React from 'react';

import { useAdminCharacteristicsState } from '../../../state';

import AdminCharacteristicsListPresenter from './presenter';
import AdminCharacteristicsListView from './view';


const AdminCharacteristicsListContainer = () => {
  const adminCharacteristicsState = useAdminCharacteristicsState();

  return (
    <AdminCharacteristicsListPresenter
      View={AdminCharacteristicsListView}
      adminCharacteristicsState={adminCharacteristicsState}
    />
  );
};

export default AdminCharacteristicsListContainer;
