import { useRouter } from 'next/router';
import React from 'react';

import { useDI } from '@eye8/di';

import ConfirmSignupPresenter from './presenter';
import ConfirmSignupView from './view';

const ConfirmSignupContainer = () => {
  const { di } = useDI();
  const router = useRouter();

  return <ConfirmSignupPresenter router={router} View={ConfirmSignupView} service={di.service.auth} />;
};

export default ConfirmSignupContainer;
