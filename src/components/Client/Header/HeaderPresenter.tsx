import * as React from 'react';

import { IContextValue as AppStateContextValue } from 'src/state/AppState';
import { IContextValue as UserStateContextValue, User } from 'src/state/UserState';

export interface IProps extends UserStateContextValue, AppStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  user: User;
  onLogOutClick: () => void;
}

export const HeaderPresenter: React.FC<IProps> = ({ View, userState: { user, clearUser }, ...viewProps }) => (
  <View user={user} onLogOutClick={clearUser} {...viewProps} />
);
