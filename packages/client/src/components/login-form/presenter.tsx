import { NextRouter } from 'next/router';
import React from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

import { ContextValue as AuthModalStateContextValue } from '@eye8/client/state/auth-modal';
import { AuthService, InvalidCredentialsError } from '@eye8/service/auth';
import { useToast, ToastId } from '@eye8/shared/context/toast';
import { isUserAdmin } from '@eye8/shared/helpers';
import { ContextValue as UserStateContextValue } from '@eye8/shared/state/user';
import { SchemaValidator } from '@eye8/shared/utils';

export interface Props extends UserStateContextValue, AuthModalStateContextValue {
  service: AuthService;
  View: React.ComponentType<ViewProps>;
  router: NextRouter;
}

export interface FormValues {
  email: string;
  password: string;
}

export interface ViewProps {
  onSubmit: (values: FormValues) => void;
  globalError: string | undefined;
  validate: (values: object) => object | Promise<object>;
  openSignup: () => void;
}

const validator = new SchemaValidator(
  yup.object().shape({
    email: yup.string().email('LoginForm.errors.email.format').required('LoginForm.errors.email.empty'),
    password: yup.string().required('LoginForm.errors.password.empty'),
  }),
);

const getErrorMessageID = (e: Error) => {
  if (e instanceof InvalidCredentialsError) {
    return 'LoginForm.errors.invalidCredentials';
  }
  return 'errors.common';
};

export const LoginPresenter = ({
  View,
  service,
  userState,
  router,
  authModalState: { open: openAuthModal, close: closeAuthModal },
}: Props) => {
  const intl = useIntl();
  const toast = useToast();
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [_, setLoading] = React.useState(false);
  const openSignup = React.useCallback(() => {
    openAuthModal('signup');
  }, [openAuthModal]);
  const onSubmit = React.useCallback(
    async (values: { email: string; password: string }) => {
      setLoading(true);

      try {
        const user = await service.logIn(values);
        userState.syncUser();

        closeAuthModal();

        toast({
          id: ToastId.LoginSuccessful,
          type: 'primary',
          children: intl.formatMessage({ id: 'Login.success' }),
          delay: 500,
          duration: 5000,
        });

        // if (isUserAdmin(user)) {
        //   router.push('/admin');
        // }
      } catch (e) {
        setError(getErrorMessageID(e));
      } finally {
        setLoading(false);
      }
    },
    [closeAuthModal, intl, router, service, userState, toast],
  );

  return <View onSubmit={onSubmit} globalError={error} validate={validator.validate} openSignup={openSignup} />;
};
