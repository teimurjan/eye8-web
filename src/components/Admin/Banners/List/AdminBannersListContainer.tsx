import * as React from 'react';
import { injectIntl } from 'react-intl';

import { AdminBannersListPresenter } from 'src/components/Admin/Banners/List/AdminBannersListPresenter';
import { AdminBannersListView } from 'src/components/Admin/Banners/List/AdminBannersListView';
import { useAdminBannersState } from 'src/state/AdminBannersState';
import { useIntlState } from 'src/state/IntlState';

const View = injectIntl(AdminBannersListView);

export const AdminBannersListContainer = () => {
  const { intlState } = useIntlState();
  const { state: adminBannersState } = useAdminBannersState();

  return <AdminBannersListPresenter View={View} adminBannersState={adminBannersState} intlState={intlState} />;
};
