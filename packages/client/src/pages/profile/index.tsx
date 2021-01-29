import React from 'react';
import { Switch, Route } from 'react-router-dom';

import { isUserAuthorized, isUserAnonymous } from '@eye8/shared/helpers';
import { useProtectedResource } from '@eye8/shared/hooks';

import Orders from '../orders';

const Profile = () => {
  const shouldShowProfile = useProtectedResource(isUserAuthorized, isUserAnonymous);

  return shouldShowProfile ? (
    <Switch>
      <Route path="/profile/orders" component={Orders} />
    </Switch>
  ) : null;
};

export default Profile;
