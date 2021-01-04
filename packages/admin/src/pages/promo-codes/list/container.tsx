import React from 'react';

import { AdminPromoCodesListPresenter } from '@eye8/admin/pages/promo-codes/list/presenter';
import { AdminPromoCodesListView } from '@eye8/admin/pages/promo-codes/list/view';
import { useAdminPromoCodesState } from '@eye8/admin/state/promo-codes';

export const AdminPromoCodesListContainer = () => {
  const { state: adminPromoCodesState } = useAdminPromoCodesState();

  return <AdminPromoCodesListPresenter View={AdminPromoCodesListView} adminPromoCodesState={adminPromoCodesState} />;
};
