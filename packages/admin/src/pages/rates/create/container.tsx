import React from 'react';
import { useHistory } from 'react-router';

import { AdminRatesCreatePresenter } from '@eye8/admin/pages/rates/create/presenter';
import { AdminRatesCreateView } from '@eye8/admin/pages/rates/create/view';
import { useDI } from '@eye8/di';

import { useAdminRatesState } from '../../../state';

export const AdminRatesCreateContainer = () => {
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
