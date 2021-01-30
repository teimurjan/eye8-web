import React from 'react';
import { useHistory } from 'react-router';

import { AdminPromoCodesCreatePresenter } from '@eye8/admin/pages/promo-codes/create/presenter';
import { AdminPromoCodesCreateView } from '@eye8/admin/pages/promo-codes/create/view';
import { useDI } from '@eye8/di';

import { useAdminPromoCodesState } from '../../../state';

export const AdminPromoCodesCreateContainer = () => {
  const history = useHistory();

  const { di } = useDI();
  const adminPromoCodesState = useAdminPromoCodesState();

  return (
    <AdminPromoCodesCreatePresenter
      history={history}
      View={AdminPromoCodesCreateView}
      service={di.service.promoCode}
      adminPromoCodesState={adminPromoCodesState}
    />
  );
};
