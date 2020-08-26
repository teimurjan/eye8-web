import * as React from 'react';

import { IContextValue as AppStateContextValue } from 'src/state/AppState';
import { IContextValue as UserStateContextValue, User } from 'src/state/UserState';

export interface IProps extends UserStateContextValue, AppStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
}

export interface IViewProps {
  user: User;
}

export const HeaderPresenter: React.FC<IProps> = ({ View, userState: { user }, ...viewProps }) => {
  return <View user={user} {...viewProps} />;
};
