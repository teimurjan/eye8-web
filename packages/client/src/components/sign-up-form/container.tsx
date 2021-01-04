import React from 'react';

import { SignUpPresenter } from '@eye8/client/components/sign-up-form/presenter';
import { SignUpView } from '@eye8/client/components/sign-up-form/view';
import { useAuthModalState } from '@eye8/client/state/auth-modal';
import { useDependencies } from '@eye8/di';

export const SignUpContainer = () => {
  const { dependencies } = useDependencies();

  const { authModalState } = useAuthModalState();

  return <SignUpPresenter service={dependencies.services.auth} View={SignUpView} authModalState={authModalState} />;
};
