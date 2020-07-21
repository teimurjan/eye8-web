import * as React from 'react';
import { useHistory } from 'react-router';

import { AdminRatesCreatePresenter } from 'src/components/Admin/Rates/Create/AdminRatesCreatePresenter';
import { AdminRatesCreateView } from 'src/components/Admin/Rates/Create/AdminRatesCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminRatesState } from 'src/state/AdminRatesState';

export const AdminRatesCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { state: adminRatesState } = useAdminRatesState();

  return (
    <AdminRatesCreatePresenter
      history={history}
      View={AdminRatesCreateView}
      service={dependencies.services.rate}
      adminRatesState={adminRatesState}
    />
  );
};
