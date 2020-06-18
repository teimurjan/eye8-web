/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import * as React from 'react';
import { Field, FieldRenderProps, Form, FormRenderProps } from 'react-final-form';
import { IntlShape } from 'react-intl';

import { Button } from 'src/components/admin-ui/Button/Button';
import { FormTextField } from 'src/components/admin-ui/FormTextField/FormTextField';
import { HelpText } from 'src/components/admin-ui/HelpText/HelpText';
import { Message } from 'src/components/admin-ui/Message/Message';
import { LinkPassingProps } from 'src/components/client-ui/LinkPassingProps/LinkPassingProps';
import { IViewProps as IProps, IFormValues } from 'src/components/SignUp/SignUpForm/SignUpFormPresenter';

export class SignUpFormView extends React.Component<IProps & { intl: IntlShape }> {
  public render() {
    const { onSubmit, validate, isSuccess, intl } = this.props;
    return isSuccess ? (
      <Message color="is-success">
        <Message.Header>{intl.formatMessage({ id: 'common.congratulations' })}</Message.Header>
        <Message.Body>{intl.formatMessage({ id: 'SignupForm.success.body' })}</Message.Body>
      </Message>
    ) : (
      <Form<IFormValues> validate={validate} onSubmit={onSubmit} render={this.renderInnerForm} />
    );
  }

  private renderInnerForm = ({ handleSubmit, submitting }: FormRenderProps<IFormValues>) => {
    const { globalError, intl } = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <Field name="name" render={this.renderNameField} />
        <Field name="email" render={this.renderEmailField} />
        <Field name="password" render={this.renderPasswordField} />
        <div className="level is-mobile">
          <Button className="level-left is-uppercase" color="is-success" loading={submitting} type="submit">
            {intl.formatMessage({ id: 'SignUpForm.submitButton.text' })}
          </Button>
          <LinkPassingProps className="level-right" href="/login">
            {intl.formatMessage({ id: 'SignUpForm.logInLink' })}
          </LinkPassingProps>
        </div>
        <div
          css={css`
            text-align: center;
          `}
        >
          {globalError && <HelpText type="is-danger">{intl.formatMessage({ id: globalError })}</HelpText>}
        </div>
      </form>
    );
  };

  private renderNameField = ({ input, meta }: FieldRenderProps<string>) => {
    const { intl } = this.props;
    const showError = meta.touched && meta.error;
    return (
      <FormTextField
        labelProps={{
          children: intl.formatMessage({ id: 'SignUpForm.nameInput.label' }),
        }}
        inputProps={{
          ...input,
          isDanger: showError,
          placeholder: intl.formatMessage({
            id: 'SignUpForm.nameInput.placeholder',
          }),
          type: 'text',
        }}
        helpTextProps={{
          children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
          type: 'is-danger',
        }}
      />
    );
  };

  private renderEmailField = ({ input, meta }: FieldRenderProps<string>) => {
    const { intl } = this.props;
    const showError = meta.touched && meta.error;
    return (
      <FormTextField
        labelProps={{
          children: intl.formatMessage({ id: 'SignUpForm.emailInput.label' }),
        }}
        inputProps={{
          ...input,
          isDanger: showError,
          placeholder: intl.formatMessage({
            id: 'SignUpForm.emailInput.placeholder',
          }),
          type: 'text',
        }}
        helpTextProps={{
          children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
          type: 'is-danger',
        }}
      />
    );
  };

  private renderPasswordField = ({ input, meta }: FieldRenderProps<string>) => {
    const { intl } = this.props;
    const showError = meta.touched && meta.error;
    return (
      <FormTextField
        labelProps={{
          children: intl.formatMessage({
            id: 'SignUpForm.passwordInput.label',
          }),
        }}
        inputProps={{
          ...input,
          isDanger: showError,
          placeholder: intl.formatMessage({
            id: 'SignUpForm.passwordInput.placeholder',
          }),
          type: 'password',
        }}
        helpTextProps={{
          children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
          type: 'is-danger',
        }}
      />
    );
  };
}
