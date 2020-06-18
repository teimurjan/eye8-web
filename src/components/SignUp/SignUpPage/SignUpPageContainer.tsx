import * as React from 'react';

import { SignUpPagePresenter } from 'src/components/SignUp/SignUpPage/SignUpPagePresenter';
import { SignUpPageView } from 'src/components/SignUp/SignUpPage/SignUpPageView';

export const SignUpPageContainer = () => {
  return <SignUpPagePresenter View={SignUpPageView} />;
};
