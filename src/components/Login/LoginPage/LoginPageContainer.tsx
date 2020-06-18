import * as React from 'react';

import { LoginPagePresenter } from 'src/components/Login/LoginPage/LoginPagePresenter';
import { LoginPageView } from 'src/components/Login/LoginPage/LoginPageView';

export const LoginPageContainer = () => {
  return <LoginPagePresenter View={LoginPageView} />;
};
