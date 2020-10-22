import { useRouter } from 'next/router';
import * as React from 'react';

import { ConfirmSignupPresenter } from 'src/components/auth/ConfirmSignup/ConfirmSignupPresenter';
import { ConfirmSignupView } from 'src/components/auth/ConfirmSignup/ConfirmSignupView';
import { useDependencies } from 'src/DI/DI';

export const ConfirmSignupContainer = () => {
  const { dependencies } = useDependencies();
  const router = useRouter();

  return <ConfirmSignupPresenter router={router} View={ConfirmSignupView} service={dependencies.services.auth} />;
};