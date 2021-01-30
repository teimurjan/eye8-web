import { useRouter } from 'next/router';
import React from 'react';

import { useAuthModalState } from '@eye8/client/state';
import { useDI } from '@eye8/di';
import { useUserState } from '@eye8/shared/state';

import LoginPresenter from './presenter';
import LoginView from './view';

const LoginContainer = () => {
  const { di } = useDI();
  const userState = useUserState();
  const authModalState = useAuthModalState();

  const router = useRouter();

  return (
    <LoginPresenter
      router={router}
      authModalState={authModalState}
      View={LoginView}
      service={di.service.auth}
      userState={userState}
    />
  );
};

export default LoginContainer;
