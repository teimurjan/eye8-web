import * as React from 'react';

import { User, IContextValue as UserStateContextValue } from 'src/state/UserState';

interface IProps extends UserStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  user: User;
  onLogoutClick: () => void;
}

export const UserDropdownPresenter = ({ View, userState: { clearUser, user } }: IProps) => (
  <View onLogoutClick={clearUser} user={user} />
);
