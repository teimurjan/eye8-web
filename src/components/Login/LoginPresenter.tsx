import { NextRouter } from 'next/router';
import * as React from 'react';
import { useIntl } from 'react-intl';
import * as yup from 'yup';

import * as schemaValidator from 'src/components/SchemaValidator';
import { ToastId } from 'src/components/Toast/ids';
import { toast } from 'src/components/Toast/ToastContainer';
import { isUserAdmin } from 'src/helpers/user';
import * as authService from 'src/services/AuthService';
import { IContextValue as AuthModalStateContextValue } from 'src/state/AuthModalState';
import { IContextValue as UserStateContextValue } from 'src/state/UserState';

export interface IProps extends UserStateContextValue, AuthModalStateContextValue {
  service: authService.IAuthService;
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
  router: NextRouter;
}

export interface IFormValues {
  email: string;
  password: string;
}

export interface IViewProps {
  onSubmit: (values: IFormValues) => void;
  globalError: string | undefined;
  validate: (values: object) => object | Promise<object>;
  openSignup: () => void;
}

const validator = new schemaValidator.SchemaValidator(
  yup.object().shape({
    email: yup.string().email('LoginForm.errors.email.format').required('LoginForm.errors.email.empty'),
    password: yup.string().required('LoginForm.errors.password.empty'),
  }),
);

export const LoginPresenter = ({
  View,
  service,
  userState,
  router,
  authModalState: { open: openAuthModal, close: closeAuthModal },
}: IProps) => {
  const intl = useIntl();
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [_, setLoading] = React.useState(false);
  const openSignup = React.useCallback(() => {
    openAuthModal('signup');
  }, [openAuthModal]);
  const onSubmit = React.useCallback(async (values: { email: string; password: string }) => {
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

      if (isUserAdmin(user)) {
        router.push('/admin');
      }
    } catch (e) {
      if (e instanceof authService.errors.InvalidCredentialsError) {
        setError('LoginForm.errors.invalidCredentials');
      } else {
        setError('errors.common');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return <View onSubmit={onSubmit} globalError={error} validate={validator.validate} openSignup={openSignup} />;
};
