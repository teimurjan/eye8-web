import React from 'react';
import { useHistory } from 'react-router';

import { useDI } from '@eye8/di';

import { useAdminRatesState } from '../../../state';

import AdminRatesCreatePresenter from './presenter';
import AdminRatesCreateView from './view';

const AdminRatesCreateContainer = () => {
  const history = useHistory();

  const { di } = useDI();
  const adminRatesState = useAdminRatesState();

  return (
    <AdminRatesCreatePresenter
      history={history}
      View={AdminRatesCreateView}
      service={di.service.rate}
      adminRatesState={adminRatesState}
    />
  );
};

export default AdminRatesCreateContainer;
