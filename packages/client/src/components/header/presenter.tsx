import React from 'react';

import { UserState, User } from '@eye8/shared/state';

export interface Props {
  View: React.ComponentType<ViewProps>;
  userState: UserState;
}

export interface ViewProps {
  user: User;
}

const HeaderPresenter: React.FC<Props> = ({ View, userState: { user }, ...viewProps }) => {
  return <View user={user} {...viewProps} />;
};

export default HeaderPresenter;
