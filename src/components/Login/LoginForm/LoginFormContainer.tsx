import { useRouter } from 'next/router';
import * as React from 'react';
import { injectIntl } from 'react-intl';

import { LoginFormPresenter } from 'src/components/Login/LoginForm/LoginFormPresenter';
import { LoginFormView } from 'src/components/Login/LoginForm/LoginFormView';
import { useDependencies } from 'src/DI/DI';
import { useUserState } from 'src/state/UserState';

export const LoginFormContainer = () => {
  const router = useRouter();

  const { dependencies } = useDependencies();
  const { userState } = useUserState();

  return (
    <LoginFormPresenter
      View={injectIntl(LoginFormView)}
      service={dependencies.services.auth}
      userState={userState}
      router={router}
    />
  );
};
