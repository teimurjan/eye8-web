import * as React from 'react';

import { SignUpPresenter } from 'src/components/auth/SignUp/SignUpPresenter';
import { SignUpView } from 'src/components/auth/SignUp/SignUpView';
import { useDependencies } from 'src/DI/DI';
import { useAuthModalState } from 'src/state/AuthModalState';

export const SignUpContainer = () => {
  const { dependencies } = useDependencies();

  const { authModalState } = useAuthModalState();

  return <SignUpPresenter service={dependencies.services.auth} View={SignUpView} authModalState={authModalState} />;
};
