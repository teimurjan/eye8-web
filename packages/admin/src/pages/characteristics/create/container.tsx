import React from 'react';
import { useHistory } from 'react-router';

import { useDI } from '@eye8/di';

import { useAdminCharacteristicsState } from '../../../state';

import AdminCharacteristicsCreatePresenter from './presenter';
import AdminCharacteristicsCreateView from './view';


const AdminCharacteristicsCreateContainer = () => {
  const history = useHistory();

  const { di } = useDI();
  const adminCharacteristicsState = useAdminCharacteristicsState();

  return (
    <AdminCharacteristicsCreatePresenter
      history={history}
      View={AdminCharacteristicsCreateView}
      service={di.service.characteristic}
      adminCharacteristicsState={adminCharacteristicsState}
    />
  );
};

export default AdminCharacteristicsCreateContainer;
