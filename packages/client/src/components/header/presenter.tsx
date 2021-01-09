import React from 'react';

import { ContextValue as UserStateContextValue, User } from '@eye8/shared/state/user';

export interface Props extends UserStateContextValue {
  View: React.ComponentType<ViewProps>;
}

export interface ViewProps {
  user: User;
}

export const HeaderPresenter: React.FC<Props> = ({ View, userState: { user }, ...viewProps }) => {
  return <View user={user} {...viewProps} />;
};
