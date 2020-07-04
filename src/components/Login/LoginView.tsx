/** @jsx jsx */
import { jsx, css } from '@emotion/core';
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
import { Title } from 'src/components/client-ui/Title/Title';
import { IViewProps as IProps, IFormValues } from 'src/components/Login/LoginPresenter';

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
    <PasswordUnderlinedInput
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
}: FormRenderProps<IFormValues> & Pick<IProps, 'globalError' | 'openSignup'>) => {
  const intl = useIntl();
  return (
    <form onSubmit={handleSubmit}>
      <FinalFormField name="email" component={EmailField} />
      <FinalFormField name="password" component={PasswordField} />
      <div css={authButtonsContainerCSS}>
        <Button css={authSubmitButtonCSS} color="primary" loading={submitting} type="submit">
          {intl.formatMessage({ id: 'LoginForm.submitButton.text' })}
        </Button>
        <Anchor onClick={openSignup}>{intl.formatMessage({ id: 'LoginForm.signUpLink' })}</Anchor>
      </div>
      <div
        css={css`
          text-align: center;
        `}
      >
        {globalError && <HelpText color="danger">{intl.formatMessage({ id: globalError })}</HelpText>}
      </div>
    </form>
  );
};

const TypedFinalForm = FinalForm as React.FC<FormProps<IFormValues> & Pick<IProps, 'globalError' | 'openSignup'>>;

export const LoginView = (props: IProps) => {
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
        component={InnerForm as React.FC<FormRenderProps<IFormValues>>}
        globalError={globalError}
      />
    </>
  );
};
