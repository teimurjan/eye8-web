import { Location } from 'history';
import React from 'react';

import { UserState, User } from '@eye8/shared/state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  userState: UserState;
  location: Location;
}

export interface ViewProps {
  onLogOutClick: () => void;
  user: User;
  pathname: string;
}

const AdminMenuPresenter = ({ userState: { clearUser, user }, View, location }: Props) => {
  const onLogoutClick = React.useCallback(() => {
    clearUser();
  }, [clearUser]);

  return <View pathname={location.pathname} onLogOutClick={onLogoutClick} user={user} />;
};

export default AdminMenuPresenter;
