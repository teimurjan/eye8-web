import React from 'react';

import { useUserState } from '@eye8/shared/state';

import HeaderPresenter from './presenter';
import HeaderView from './view';

const HeaderContainer = () => {
  const userState = useUserState();

  return <HeaderPresenter userState={userState} View={HeaderView} />;
};

export default HeaderContainer;
