import * as React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

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
  defaultValue?: string;
}

export interface IProps {
  key_: string;
  label: string;
  placeholder: string;
  locales: IIntlListResponseItem[];
  component?: React.SFC<FieldRenderProps<string> & IIntlFieldRendererProps>;
}

const IntlField_: IProps['component'] = ({ input, meta, label, placeholder, locale }) => {
  const intl = useIntl();

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

export const IntlField = ({ component, label, locales, placeholder, key_ }: IProps) => {
  return (
    <>
      {locales.map(locale => (
        <Field
          key={locale.id}
          name={getFieldName(key_, locale)}
          label={label}
          locale={locale}
          placeholder={placeholder}
          component={component ? component : IntlField_}
        />
      ))}
    </>
  );
};
