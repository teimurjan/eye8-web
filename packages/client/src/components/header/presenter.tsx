import React from 'react';

import { IContextValue as UserStateContextValue, User } from '@eye8/shared/state/user';

export interface IProps extends UserStateContextValue {
  View: React.ComponentType<IViewProps>;
}

export interface IViewProps {
  user: User;
}

export const HeaderPresenter: React.FC<IProps> = ({ View, userState: { user }, ...viewProps }) => {
  return <View user={user} {...viewProps} />;
};
