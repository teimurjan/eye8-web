import { NextRouter } from 'next/router';
import * as React from 'react';
import * as yup from 'yup';

import * as schemaValidator from 'src/components/SchemaValidator';
import * as authService from 'src/services/AuthService';
import { IContextValue as UserStateContextValue } from 'src/state/UserState';

export interface IProps extends UserStateContextValue {
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
}

interface IState {
  error: string | undefined;
  isLoading: boolean;
}

export class LoginFormPresenter extends React.Component<IProps, IState> {
  public state = {
    error: undefined,
    isLoading: false,
  };

  private validator: schemaValidator.ISchemaValidator;

  constructor(props: IProps) {
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
    return <View onSubmit={this.onSubmit} globalError={error} validate={this.validator.validate} />;
  }

  private onSubmit = async (values: { email: string; password: string }) => {
    this.startLoading();

    const { service, router, userState } = this.props;

    try {
      await service.logIn(values.email, values.password);
      userState.syncUser();

      this.stopLoading();

      router.push('/');
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
}
