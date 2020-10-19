import * as React from 'react';
import { useHistory } from 'react-router';

import { AdminRatesCreatePresenter } from 'src/components/admin/pages/Rates/Create/AdminRatesCreatePresenter';
import { AdminRatesCreateView } from 'src/components/admin/pages/Rates/Create/AdminRatesCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminRatesState } from 'src/state/Admin/AdminRatesState';

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
