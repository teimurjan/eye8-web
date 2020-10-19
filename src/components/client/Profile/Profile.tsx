import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { OrdersContainer } from 'src/components/client/Profile/Orders/OrdersContainer';
import { isUserAuthorized, isUserAnonymous } from 'src/helpers/user';
import { useProtectedResource } from 'src/hooks/useProtectedResource';

export const Profile = () => {
  const shouldShowProfile = useProtectedResource(isUserAuthorized, isUserAnonymous);

  return shouldShowProfile ? (
    <Switch>
      <Route path="/profile/orders" component={OrdersContainer} />
    </Switch>
  ) : null;
};
