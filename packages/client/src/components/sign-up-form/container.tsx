import React from 'react';

import { useAuthModalState } from '@eye8/client/state';
import { useDI } from '@eye8/di';

import SignUpPresenter from './presenter';
import SignUpView from './view';

const SignUpContainer = () => {
  const { di } = useDI();

  const authModalState = useAuthModalState();

  return <SignUpPresenter service={di.service.auth} View={SignUpView} authModalState={authModalState} />;
};

export default SignUpContainer;
