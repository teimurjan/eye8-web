import React from 'react';
import { useHistory, useLocation } from 'react-router';

import { OrdersPresenter } from 'src/components/Client/Profile/Orders/OrdersPresenter';
import { OrdersView } from 'src/components/Client/Profile/Orders/OrdersView';
import { useDependencies } from 'src/DI/DI';
import { isUserAuthorized } from 'src/helpers/user';
import { useUserState, AuthorizedUser } from 'src/state/UserState';

export const OrdersContainer = () => {
  const {
    dependencies: {
      services: { order: orderService },
    },
  } = useDependencies();

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
