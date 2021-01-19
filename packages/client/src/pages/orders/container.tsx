import React from 'react';
import { useHistory, useLocation } from 'react-router';

import { OrdersPresenter } from '@eye8/client/pages/orders/presenter';
import { OrdersView } from '@eye8/client/pages/orders/view';
import { useDI } from '@eye8/di';
import { isUserAuthorized } from '@eye8/shared/helpers';
import { useUserState, AuthorizedUser } from '@eye8/shared/state/user';

export const OrdersContainer = () => {
  const {
    di: {
      service: { order: orderService },
    },
  } = useDI();

  const {
    userState: { user },
  } = useUserState();

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
