import React from 'react';
import * as yup from 'yup';

import { IContextValue as AuthModalStateContextValue } from '@eye8/client/state/auth-modal';
import { EmailExistsError, IAuthService } from '@eye8/service/auth';
import { SchemaValidator } from '@eye8/shared/utils';

export interface IProps extends AuthModalStateContextValue {
  service: IAuthService;
  View: React.ComponentType<IViewProps>;
}

export interface IFormValues {
  email: string;
  name: string;
  password: string;
}

export interface IViewProps {
  onSubmit: (values: IFormValues) => void;
  globalError: string | undefined;
  validate: (values: IFormValues) => object | Promise<object>;
  isSuccess: boolean;
  openLogin: () => void;
}

interface IState {
  error: string | undefined;
  isLoading: boolean;
  isSuccess: boolean;
}

export class SignUpPresenter extends React.Component<IProps, IState> {
  public state = {
    error: undefined,
    isLoading: false,
    isSuccess: false,
  };

  private validator: SchemaValidator;

  constructor(props: IProps) {
    super(props);
    this.validator = new SchemaValidator(
      yup.object().shape({
        email: yup.string().email('SignUpForm.errors.email.format').required('SignUpForm.errors.email.empty'),
        name: yup.string().required('SignUpForm.errors.name.empty'),
        password: yup
          .string()
          .required('SignUpForm.errors.email.empty')
          .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, 'SignUpForm.errors.password.regex'),
      }),
    );
  }

  public render() {
    const { error, isSuccess } = this.state;
    const { View } = this.props;
    return (
      <View
        isSuccess={isSuccess}
        onSubmit={this.onSubmit}
        globalError={error}
        validate={this.validator.validate}
        openLogin={this.openLogin}
      />
    );
  }

  private openLogin = () => {
    const {
      authModalState: { open: openAuthModal },
    } = this.props;
    openAuthModal('login');
  };

  private onSubmit = async (values: IFormValues) => {
    this.startLoading();

    const { service } = this.props;

    try {
      await service.signUp(values);

      this.setSuccess();
    } catch (e) {
      if (e instanceof EmailExistsError) {
        this.setGlobalError('SignUpForm.errors.emailExists');
      } else {
        this.setGlobalError('errors.common');
      }
    } finally {
      this.stopLoading();
    }
  };

  private startLoading = () => this.setState({ error: undefined, isLoading: true });

  private stopLoading = () => this.setState({ isLoading: false });

  private setSuccess = () => this.setState({ isSuccess: true });

  private setGlobalError = (error: string | undefined) => this.setState({ error });
}
