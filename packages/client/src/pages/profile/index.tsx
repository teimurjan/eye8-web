import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { OrdersContainer } from '@eye8/client/pages/orders/container';
import { isUserAuthorized, isUserAnonymous } from '@eye8/shared/helpers';
import { useProtectedResource } from '@eye8/shared/hooks';

export const Profile = () => {
  const shouldShowProfile = useProtectedResource(isUserAuthorized, isUserAnonymous);

  return shouldShowProfile ? (
    <Switch>
      <Route path="/profile/orders" component={OrdersContainer} />
    </Switch>
  ) : null;
};
