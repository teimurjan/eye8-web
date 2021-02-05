import React from 'react';
import { FieldRenderProps, Field as FinalFormField } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Field, FileInput, FormTextField, HelpText, Label, Tag } from '@eye8/admin-ui';
import { Wysiwyg } from '@eye8/shared/components';
import { isAllowedForNumberInput } from '@eye8/shared/utils';

import { IntlField, IntlFieldProps } from '../../../components';

export interface FieldsProps {
  textFieldKey: string;
  linkTextFieldKey: string;
}

const ImageField = ({ input, meta }: FieldRenderProps<File>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <Field>
      <Label>{intl.formatMessage({ id: 'AdminProductTypes.image' })}</Label>
      <FileInput
        {...input}
        accept="image/*"
        placeholder={intl.formatMessage({
          id: 'common.chooseImage',
        })}
      />
      <HelpText type="is-danger">{showError ? intl.formatMessage({ id: meta.error }) : undefined}</HelpText>
    </Field>
  );
};

const LinkField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;
  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminBanners.linkInput.label' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: 'AdminBanners.linkInput.placeholder',
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

const TextColorField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;
  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminBanners.textColorInput.label' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder: intl.formatMessage({
          id: 'AdminBanners.textColorInput.placeholder',
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

const getOffsetFieldRenderer = (label: string, placeholder: string) => ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: label,
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder,
        type: 'number',
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
      allowValue={isAllowedForNumberInput}
    />
  );
};

const TextField: IntlFieldProps['component'] = ({ input, meta, label, placeholder, locale }) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: (
          <>
            {label} <Tag color="is-primary">{locale}</Tag>
          </>
        ),
      }}
      renderInput={() => (
        <Wysiwyg
          initialValue={input.value}
          placeholder={placeholder}
          onChange={input.onChange}
          onBlur={input.onBlur}
          onFocus={input.onFocus}
          hasError={showError}
        />
      )}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const Fields = ({ textFieldKey, linkTextFieldKey }: FieldsProps) => {
  const intl = useIntl();

  return (
    <>
      <IntlField
        key_={textFieldKey}
        label={intl.formatMessage({
          id: 'AdminBanners.textInput.label',
        })}
        placeholder={intl.formatMessage({
          id: 'AdminBanners.textInput.placeholder',
        })}
        component={TextField}
      />
      <IntlField
        key_={linkTextFieldKey}
        label={intl.formatMessage({
          id: 'AdminBanners.linkTextInput.label',
        })}
        placeholder={intl.formatMessage({
          id: 'AdminBanners.linkTextInput.placeholder',
        })}
      />
      <FinalFormField key="image" name="image" component={ImageField} />
      <FinalFormField key="link" name="link" component={LinkField} />
      <FinalFormField key="text_color" name="text_color" component={TextColorField} />
      <FinalFormField
        key="text_top_offset"
        name="text_top_offset"
        render={getOffsetFieldRenderer(intl.formatMessage({ id: 'AdminBanners.topOffsetInput.label' }), '0')}
      />
      <FinalFormField
        key="text_bottom_offset"
        name="text_bottom_offset"
        render={getOffsetFieldRenderer(intl.formatMessage({ id: 'AdminBanners.bottomOffsetInput.label' }), '0')}
      />
      <FinalFormField
        key="text_left_offset"
        name="text_left_offset"
        render={getOffsetFieldRenderer(intl.formatMessage({ id: 'AdminBanners.leftOffsetInput.label' }), '0')}
      />
      <FinalFormField
        key="text_right_offset"
        name="text_right_offset"
        render={getOffsetFieldRenderer(intl.formatMessage({ id: 'AdminBanners.rightOffsetInput.label' }), '0')}
      />
    </>
  );
};

export default Fields;
