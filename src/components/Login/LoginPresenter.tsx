import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import * as yup from 'yup';

import * as schemaValidator from 'src/components/SchemaValidator';
import { ToastId } from 'src/components/Toast/ids';
import { toast } from 'src/components/Toast/ToastContainer';
import * as authService from 'src/services/AuthService';
import { IContextValue as AuthModalStateContextValue } from 'src/state/AuthModalState';
import { IContextValue as UserStateContextValue } from 'src/state/UserState';

export interface IProps extends UserStateContextValue, AuthModalStateContextValue {
  service: authService.IAuthService;
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
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

interface IState {
  error: string | undefined;
  isLoading: boolean;
}

type IPropsWithIntl = IProps & { intl: IntlShape };

export const LoginPresenter = injectIntl<'intl', IPropsWithIntl>(
  class extends React.Component<IPropsWithIntl, IState> {
    public state = {
      error: undefined,
      isLoading: false,
    };

    private validator: schemaValidator.ISchemaValidator;

    constructor(props: IPropsWithIntl) {
      super(props);
      this.validator = new schemaValidator.SchemaValidator(
        yup.object().shape({
          email: yup
            .string()
            .email('LoginForm.errors.email.format')
            .required('LoginForm.errors.email.empty'),
          password: yup.string().required('LoginForm.errors.password.empty'),
        }),
      );
    }

    public render() {
      const { error } = this.state;
      const { View } = this.props;
      return (
        <View
          onSubmit={this.onSubmit}
          globalError={error}
          validate={this.validator.validate}
          openSignup={this.openSignup}
        />
      );
    }

    private openSignup = () => {
      const {
        authModalState: { open: openAuthModal },
      } = this.props;
      openAuthModal('signup');
    };

    private onSubmit = async (values: { email: string; password: string }) => {
      this.startLoading();

      const {
        service,
        userState,
        intl,
        authModalState: { close: closeAuthModal },
      } = this.props;

      try {
        await service.logIn(values.email, values.password);
        userState.syncUser();

        this.stopLoading();

        closeAuthModal();

        toast({
          id: ToastId.LoginSuccessful,
          type: 'primary',
          children: intl.formatMessage({ id: 'Login.success' }),
          delay: 500,
          duration: 5000,
        });
      } catch (e) {
        if (e instanceof authService.errors.InvalidCredentialsError) {
          this.setGlobalError('LoginForm.errors.invalidCredentials');
        } else {
          this.setGlobalError('errors.common');
        }
        this.stopLoading();
      }
    };

    private startLoading = () => this.setState({ error: undefined, isLoading: true });

    private stopLoading = () => this.setState({ isLoading: false });

    private setGlobalError = (error: string | undefined) => this.setState({ error });
  },
);
