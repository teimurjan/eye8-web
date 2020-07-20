/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import * as React from 'react';
import {
  Field as FinalFormField,
  FieldRenderProps,
  Form as FinalForm,
  FormRenderProps,
  FormProps,
} from 'react-final-form';
import { useIntl } from 'react-intl';

import { Anchor } from 'src/components/client-ui/Anchor/Anchor';
import { Button } from 'src/components/client-ui/Button/Button';
import { PasswordUnderlinedInput } from 'src/components/client-ui/Form/PasswordInput/PasswordInput';
import { UnderlinedInput } from 'src/components/client-ui/Form/UnderlinedInput/UnderlinedInput';
import { HelpText } from 'src/components/client-ui/HelpText/HelpText';
import { Message } from 'src/components/client-ui/Message/Message';
import { Title } from 'src/components/client-ui/Title/Title';
import { authButtonsContainerCSS } from 'src/components/Login/LoginView';
import { IViewProps as IProps, IFormValues } from 'src/components/SignUp/SignUpPresenter';

const NameField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error && meta.submitFailed;
  return (
    <UnderlinedInput
      autoFocus
      autoFocusDelay={500}
      placeholder={intl.formatMessage({ id: 'SignUpForm.nameInput.label' })}
      error={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      {...input}
    />
  );
};

const EmailField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error && meta.submitFailed;
  return (
    <UnderlinedInput
      placeholder={intl.formatMessage({ id: 'SignUpForm.emailInput.label' })}
      error={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      {...input}
    />
  );
};

const PasswordField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error && meta.submitFailed;
  return (
    <PasswordUnderlinedInput
      placeholder={intl.formatMessage({ id: 'SignUpForm.passwordInput.label' })}
      error={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      {...input}
    />
  );
};

const authSubmitButtonCSS = css`
  width: 200px;
  height: 40px;
`;

const InnerForm = ({
  handleSubmit,
  submitting,
  globalError,
  openLogin,
}: FormRenderProps<IFormValues> & Pick<IProps, 'globalError' | 'openLogin'>) => {
  const intl = useIntl();
  return (
    <form onSubmit={handleSubmit}>
      <FinalFormField name="name" component={NameField} />
      <FinalFormField name="email" component={EmailField} />
      <FinalFormField name="password" component={PasswordField} />
      <div css={authButtonsContainerCSS}>
        <Button css={authSubmitButtonCSS} color="primary" loading={submitting} type="submit">
          {intl.formatMessage({ id: 'SignUpForm.submitButton.text' })}
        </Button>
        <Anchor onClick={openLogin} weight={Anchor.Weight.Normal}>
          {intl.formatMessage({ id: 'SignUpForm.logInLink' })}
        </Anchor>
      </div>
      <div
        css={css`
          text-align: center;
        `}
      >
        {globalError && <HelpText color={HelpText.Color.Danger}>{intl.formatMessage({ id: globalError })}</HelpText>}
      </div>
    </form>
  );
};

const TypedFinalForm = FinalForm as React.FC<FormProps<IFormValues> & Pick<IProps, 'globalError' | 'openLogin'>>;

export const SignUpView = (props: IProps) => {
  const intl = useIntl();
  const { onSubmit, validate, globalError, isSuccess, openLogin } = props;

  return (
    <>
      {isSuccess ? (
        <Message color="primary">
          <Title size={3}>{intl.formatMessage({ id: 'common.congratulations' })}</Title>
          {intl.formatMessage({ id: 'SignupForm.success.body' })}
        </Message>
      ) : (
        <>
          <Title
            css={css`
              margin-bottom: 30px;
            `}
            size={3}
          >
            {intl.formatMessage({ id: 'SignUpPage.title' })}
          </Title>
          <TypedFinalForm
            validate={validate}
            onSubmit={onSubmit}
            component={InnerForm as React.FC<FormRenderProps<IFormValues>>}
            globalError={globalError}
            openLogin={openLogin}
          />
        </>
      )}
    </>
  );
};
