import React from 'react';

import { UserState, User } from '@eye8/shared/state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  userState: UserState;
}

export interface ViewProps {
  onLogOutClick: () => void;
  user: User;
}

const AdminMenuPresenter = ({ userState: { clearUser, user }, View }: Props) => {
  const onLogoutClick = React.useCallback(() => {
    clearUser();
  }, [clearUser]);

  return <View onLogOutClick={onLogoutClick} user={user} />;
};

export default AdminMenuPresenter;
