import { useRouter } from 'next/router';
import React from 'react';

import { ConfirmSignupPresenter } from '@eye8/client/components/confirm-signup/presenter';
import { ConfirmSignupView } from '@eye8/client/components/confirm-signup/view';
import { useDI } from '@eye8/di';

export const ConfirmSignupContainer = () => {
  const { di } = useDI();
  const router = useRouter();

  return <ConfirmSignupPresenter router={router} View={ConfirmSignupView} service={di.service.auth} />;
};
