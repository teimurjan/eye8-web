
import { css } from '@emotion/react';
import {
  Field as FinalFormField,
  FieldRenderProps,
  Form as FinalForm,
  FormRenderProps,
  FormProps,
} from 'react-final-form';
import { useIntl } from 'react-intl';

import { Anchor, Button, PasswordInput, UnderlinedInput, HelpText, Title } from '@eye8/client-ui';

import { ViewProps as Props, FormValues } from './presenter';

const EmailField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error && meta.submitFailed;
  return (
    <UnderlinedInput
      autoFocusDelay={500}
      placeholder={intl.formatMessage({ id: 'LoginForm.emailInput.label' })}
      error={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      {...input}
    />
  );
};

const PasswordField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error && meta.submitFailed;
  return (
    <PasswordInput
      placeholder={intl.formatMessage({ id: 'LoginForm.passwordInput.label' })}
      error={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      type="password"
      {...input}
    />
  );
};

export const authButtonsContainerCSS = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 20px;
`;

const authSubmitButtonCSS = css`
  width: 150px;
  height: 40px;
`;

const InnerForm = ({
  handleSubmit,
  globalError,
  submitting,
  openSignup,
}: FormRenderProps<FormValues> & Pick<Props, 'globalError' | 'openSignup'>) => {
  const intl = useIntl();
  return (
    <form onSubmit={handleSubmit}>
      <FinalFormField name="email" component={EmailField} />
      <FinalFormField name="password" component={PasswordField} />
      <div css={authButtonsContainerCSS}>
        <Button css={authSubmitButtonCSS} color="primary" loading={submitting} type="submit">
          {intl.formatMessage({ id: 'LoginForm.submitButton.text' })}
        </Button>
        <Anchor onClick={openSignup} underline>
          {intl.formatMessage({ id: 'LoginForm.signUpLink' })}
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

const TypedFinalForm = FinalForm as React.FC<FormProps<FormValues> & Pick<Props, 'globalError' | 'openSignup'>>;

const LoginView = (props: Props) => {
  const intl = useIntl();
  const { onSubmit, validate, globalError, openSignup } = props;

  return (
    <>
      <Title
        css={css`
          margin-bottom: 30px;
        `}
        size={3}
      >
        {intl.formatMessage({ id: 'LoginPage.title' })}
      </Title>
      <TypedFinalForm
        openSignup={openSignup}
        validate={validate}
        onSubmit={onSubmit}
        component={InnerForm as React.FC<FormRenderProps<FormValues>>}
        globalError={globalError}
      />
    </>
  );
};

export default LoginView;
