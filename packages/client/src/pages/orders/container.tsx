import React from 'react';
import { useHistory, useLocation } from 'react-router';

import { useDI } from '@eye8/di';
import { isUserAuthorized } from '@eye8/shared/helpers';
import { useUserState, AuthorizedUser } from '@eye8/shared/state';

import OrdersPresenter from './presenter';
import OrdersView from './view';

const OrdersContainer = () => {
  const {
    di: {
      service: { order: orderService },
    },
  } = useDI();

  const { user } = useUserState();

  const history = useHistory();
  const location = useLocation();

  return isUserAuthorized(user) ? (
    <OrdersPresenter
      View={OrdersView}
      service={orderService}
      user={user as AuthorizedUser}
      history={history}
      location={location}
    />
  ) : null;
};

export default OrdersContainer;
