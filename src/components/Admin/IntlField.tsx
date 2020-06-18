import * as React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { IntlShape, injectIntl } from 'react-intl';

import { IIntlListResponseItem } from 'src/api/IntlAPI';
import { FormTextField } from 'src/components/admin-ui/FormTextField/FormTextField';
import { Tag } from 'src/components/admin-ui/Tag/Tag';

export const getFieldName = (key: string, locale: IIntlListResponseItem): string =>
  `${key}-${locale.name}-${locale.id}`;
export const parseFieldName = (fieldName: string): { id: number; key: string } => {
  const splittedFieldName = fieldName.split('-');
  return {
    id: parseInt(splittedFieldName.pop() || '', 10),
    key: splittedFieldName.shift() || '',
  };
};

interface IIntlFieldRendererProps {
  label: string;
  placeholder: string;
  locale: IIntlListResponseItem;
  intl: IntlShape;
  defaultValue?: string;
}

export interface IProps {
  key_: string;
  label: string;
  placeholder: string;
  locales: IIntlListResponseItem[];
  render?: (props: FieldRenderProps<string> & IIntlFieldRendererProps) => React.ReactNode;
}

const renderIntlField = ({
  input,
  meta,
  label,
  placeholder,
  locale,
  intl,
}: FieldRenderProps<string> & IIntlFieldRendererProps) => {
  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: (
          <>
            {label} <Tag color="is-primary">{locale.name}</Tag>
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

export const IntlField = injectIntl(
  ({ render, intl, label, locales, placeholder, key_ }: IProps & { intl: IntlShape }) => (
    <>
      {locales.map(locale => (
        <Field
          key={locale.id}
          name={getFieldName(key_, locale)}
          render={render ? render : renderIntlField}
          intl={intl}
          label={label}
          locale={locale}
          placeholder={placeholder}
        />
      ))}
    </>
  ),
);
