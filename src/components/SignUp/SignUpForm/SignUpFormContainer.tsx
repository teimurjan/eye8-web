import * as React from 'react';
import { injectIntl } from 'react-intl';

import { SignUpFormPresenter } from 'src/components/SignUp/SignUpForm/SignUpFormPresenter';
import { SignUpFormView } from 'src/components/SignUp/SignUpForm/SignUpFormView';
import { useDependencies } from 'src/DI/DI';

export const SignUpFormContainer = () => {
  const { dependencies } = useDependencies();

  return <SignUpFormPresenter service={dependencies.services.auth} View={injectIntl(SignUpFormView)} />;
};
