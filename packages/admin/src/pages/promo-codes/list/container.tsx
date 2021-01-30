import React from 'react';

import { AdminPromoCodesListPresenter } from '@eye8/admin/pages/promo-codes/list/presenter';
import { AdminPromoCodesListView } from '@eye8/admin/pages/promo-codes/list/view';

import { useAdminPromoCodesState } from '../../../state';

export const AdminPromoCodesListContainer = () => {
  const adminPromoCodesState = useAdminPromoCodesState();

  return <AdminPromoCodesListPresenter View={AdminPromoCodesListView} adminPromoCodesState={adminPromoCodesState} />;
};
