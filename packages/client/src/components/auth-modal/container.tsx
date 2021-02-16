import React from 'react';

import { useAuthModalState } from '@eye8/client/state';

import AuthModalPresenter from './presenter';
import AuthModalView from './view';

const AuthModalContainer = () => {
  const authModalState = useAuthModalState();

  return <AuthModalPresenter authModalState={authModalState} View={AuthModalView} />;
};

export default AuthModalContainer;
