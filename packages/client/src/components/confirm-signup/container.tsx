import { useRouter } from 'next/router';
import React from 'react';

import { ConfirmSignupPresenter } from '@eye8/client/components/confirm-signup/presenter';
import { ConfirmSignupView } from '@eye8/client/components/confirm-signup/view';
import { useDependencies } from '@eye8/di';

export const ConfirmSignupContainer = () => {
  const { dependencies } = useDependencies();
  const router = useRouter();

  return <ConfirmSignupPresenter router={router} View={ConfirmSignupView} service={dependencies.services.auth} />;
};
