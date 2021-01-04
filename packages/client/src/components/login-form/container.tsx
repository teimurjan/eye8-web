import { useRouter } from 'next/router';
import React from 'react';

import { LoginPresenter } from '@eye8/client/components/login-form/presenter';
import { LoginView } from '@eye8/client/components/login-form/view';
import { useAuthModalState } from '@eye8/client/state/auth-modal';
import { useDependencies } from '@eye8/di';
import { useUserState } from '@eye8/shared/state/user';

export const LoginContainer = () => {
  const { dependencies } = useDependencies();
  const { userState } = useUserState();
  const { authModalState } = useAuthModalState();

  const router = useRouter();

  return (
    <LoginPresenter
      router={router}
      authModalState={authModalState}
      View={LoginView}
      service={dependencies.services.auth}
      userState={userState}
    />
  );
};
