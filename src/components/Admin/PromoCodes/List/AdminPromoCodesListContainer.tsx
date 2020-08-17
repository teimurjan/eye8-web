import * as React from 'react';
import { useLocation } from 'react-router';

import { AdminPromoCodesListPresenter } from 'src/components/Admin/PromoCodes/List/AdminPromoCodesListPresenter';
import { AdminPromoCodesListView } from 'src/components/Admin/PromoCodes/List/AdminPromoCodesListView';
import { useAdminPromoCodesState } from 'src/state/AdminPromoCodesState';
import { useIntlState } from 'src/state/IntlState';

export const AdminPromoCodesListContainer = () => {
  const { intlState } = useIntlState();
  const { state: adminPromoCodesState } = useAdminPromoCodesState();

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const deleted = searchParams.get('deleted') === 'true';

  return (
    <AdminPromoCodesListPresenter
      deleted={deleted}
      View={AdminPromoCodesListView}
      adminPromoCodesState={adminPromoCodesState}
      intlState={intlState}
    />
  );
};
