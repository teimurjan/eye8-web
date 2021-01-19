import React from 'react';

import { SignUpPresenter } from '@eye8/client/components/sign-up-form/presenter';
import { SignUpView } from '@eye8/client/components/sign-up-form/view';
import { useAuthModalState } from '@eye8/client/state/auth-modal';
import { useDI } from '@eye8/di';

export const SignUpContainer = () => {
  const { di } = useDI();

  const { authModalState } = useAuthModalState();

  return <SignUpPresenter service={di.service.auth} View={SignUpView} authModalState={authModalState} />;
};
