import React from 'react';

import { HeaderPresenter } from '@eye8/client/components/header/presenter';
import { HeaderView } from '@eye8/client/components/header/view';
import { useUserState } from '@eye8/shared/state/user';

export const HeaderContainer = () => {
  const { userState } = useUserState();

  return <HeaderPresenter userState={userState} View={HeaderView} />;
};
