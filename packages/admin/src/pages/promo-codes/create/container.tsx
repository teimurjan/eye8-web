import React from 'react';
import { useHistory } from 'react-router';

import { useDI } from '@eye8/di';

import { useAdminPromoCodesState } from '../../../state';

import AdminPromoCodesCreatePresenter from './presenter';
import AdminPromoCodesCreateView from './view';

const AdminPromoCodesCreateContainer = () => {
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

export default AdminPromoCodesCreateContainer;
