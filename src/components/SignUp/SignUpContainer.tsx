import * as React from 'react';

import { SignUpPresenter } from 'src/components/SignUp/SignUpPresenter';
import { SignUpView } from 'src/components/SignUp/SignUpView';
import { useDependencies } from 'src/DI/DI';
import { useAuthModalState } from 'src/state/AuthModalState';

export const SignUpContainer = () => {
  const { dependencies } = useDependencies();

  const { authModalState } = useAuthModalState();

  return <SignUpPresenter service={dependencies.services.auth} View={SignUpView} authModalState={authModalState} />;
};
