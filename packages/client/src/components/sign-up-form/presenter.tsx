import React from 'react';
import * as yup from 'yup';

import { AuthModalState } from '@eye8/client/state';
import { DuplicateEmailError, AuthService } from '@eye8/service';
import { SchemaValidator } from '@eye8/shared/utils';

export interface Props {
  service: AuthService;
  View: React.ComponentType<ViewProps>;
  authModalState: AuthModalState;
}

export interface FormValues {
  email: string;
  name: string;
  password: string;
}

export interface ViewProps {
  onSubmit: (values: FormValues) => void;
  globalError: string | undefined;
  validate: (values: FormValues) => object | Promise<object>;
  isSuccess: boolean;
  openLogin: () => void;
}

interface State {
  error: string | undefined;
  isLoading: boolean;
  isSuccess: boolean;
}

class SignUpPresenter extends React.Component<Props, State> {
  public state = {
    error: undefined,
    isLoading: false,
    isSuccess: false,
  };

  private validator: SchemaValidator;

  constructor(props: Props) {
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

  private onSubmit = async (values: FormValues) => {
    this.startLoading();

    const { service } = this.props;

    try {
      await service.signUp(values);

      this.setSuccess();
    } catch (e) {
      if (e instanceof DuplicateEmailError) {
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

export default SignUpPresenter;
