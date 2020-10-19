import { useRouter } from 'next/router';
import * as React from 'react';

import { LoginPresenter } from 'src/components/auth/Login/LoginPresenter';
import { LoginView } from 'src/components/auth/Login/LoginView';
import { useDependencies } from 'src/DI/DI';
import { useAuthModalState } from 'src/state/AuthModalState';
import { useUserState } from 'src/state/UserState';

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
