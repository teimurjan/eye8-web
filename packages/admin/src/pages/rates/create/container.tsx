import React from 'react';
import { useHistory } from 'react-router';

import { AdminRatesCreatePresenter } from '@eye8/admin/pages/rates/create/presenter';
import { AdminRatesCreateView } from '@eye8/admin/pages/rates/create/view';
import { useAdminRatesState } from '@eye8/admin/state/rates';
import { useDI } from '@eye8/di';

export const AdminRatesCreateContainer = () => {
  const history = useHistory();

  const { di } = useDI();
  const { state: adminRatesState } = useAdminRatesState();

  return (
    <AdminRatesCreatePresenter
      history={history}
      View={AdminRatesCreateView}
      service={di.service.rate}
      adminRatesState={adminRatesState}
    />
  );
};
