import * as React from 'react';
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router';

import { AdminBannersCreatePresenter } from 'src/components/Admin/Banners/Create/AdminBannersCreatePresenter';
import { AdminBannersCreateView } from 'src/components/Admin/Banners/Create/AdminBannersCreateView';
import { useDependencies } from 'src/DI/DI';
import { useAdminBannersState } from 'src/state/AdminBannersState';
import { useIntlState } from 'src/state/IntlState';

const View = injectIntl(AdminBannersCreateView);

export const AdminBannersCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { state: adminBannersState } = useAdminBannersState();
  const { intlState } = useIntlState();

  return (
    <AdminBannersCreatePresenter
      history={history}
      View={View}
      service={dependencies.services.banner}
      intlState={intlState}
      adminBannersState={adminBannersState}
    />
  );
};
