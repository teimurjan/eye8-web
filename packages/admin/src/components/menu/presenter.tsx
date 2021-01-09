import React from 'react';

import { ContextValue as UserStateContextValue, User } from '@eye8/shared/state/user';

export interface Props extends UserStateContextValue {
  View: React.ComponentType<ViewProps>;
}

export interface ViewProps {
  onLogOutClick: () => void;
  user: User;
}

export const AdminMenuPresenter = ({ userState: { clearUser, user }, View }: Props) => {
  const onLogoutClick = React.useCallback(() => {
    clearUser();
  }, [clearUser]);

  return <View onLogOutClick={onLogoutClick} user={user} />;
};
