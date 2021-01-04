import React from 'react';
import { useHistory } from 'react-router';

import { AdminPromoCodesCreatePresenter } from '@eye8/admin/pages/promo-codes/create/presenter';
import { AdminPromoCodesCreateView } from '@eye8/admin/pages/promo-codes/create/view';
import { useAdminPromoCodesState } from '@eye8/admin/state/promo-codes';
import { useDependencies } from '@eye8/di';

export const AdminPromoCodesCreateContainer = () => {
  const history = useHistory();

  const { dependencies } = useDependencies();
  const { state: adminPromoCodesState } = useAdminPromoCodesState();

  return (
    <AdminPromoCodesCreatePresenter
      history={history}
      View={AdminPromoCodesCreateView}
      service={dependencies.services.promoCode}
      adminPromoCodesState={adminPromoCodesState}
    />
  );
};
