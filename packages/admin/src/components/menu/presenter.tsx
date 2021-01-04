import React from 'react';

import { IContextValue as UserStateContextValue, User } from '@eye8/shared/state/user';

export interface IProps extends UserStateContextValue {
  View: React.ComponentType<IViewProps>;
}

export interface IViewProps {
  onLogOutClick: () => void;
  user: User;
}

export const AdminMenuPresenter = ({ userState: { clearUser, user }, View }: IProps) => {
  const onLogoutClick = React.useCallback(() => {
    clearUser();
  }, [clearUser]);

  return <View onLogOutClick={onLogoutClick} user={user} />;
};
