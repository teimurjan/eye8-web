import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Tag, FormTextField } from '@eye8/admin-ui';
import { availableLocales, Locale } from '@eye8/shared/utils';

export const getFieldName = (key: string, locale: Locale): string => `${key}-${locale}`;
export const parseFieldName = (fieldName: string): { locale: string; key: string } => {
  const splittedFieldName = fieldName.split('-');
  return {
    locale: splittedFieldName.pop() ?? '',
    key: splittedFieldName.shift() ?? '',
  };
};

interface IntlFieldRendererProps {
  label: string;
  placeholder: string;
  locale: Locale;
  defaultValue?: string;
}

export interface Props {
  key_: string;
  label: string;
  placeholder: string;
  component?: React.SFC<FieldRenderProps<string> & IntlFieldRendererProps>;
}

const InnerIntlField: Props['component'] = ({ input, meta, label, placeholder, locale }) => {
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
      inputProps={{
        ...input,
        isDanger: showError,
        placeholder,
        type: 'text',
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const IntlField = ({ component, label, placeholder, key_ }: Props) => {
  return (
    <>
      {availableLocales.map((locale) => (
        <Field
          key={locale}
          name={getFieldName(key_, locale)}
          label={label}
          locale={locale}
          placeholder={placeholder}
          component={component ? component : InnerIntlField}
        />
      ))}
    </>
  );
};

export default IntlField;
