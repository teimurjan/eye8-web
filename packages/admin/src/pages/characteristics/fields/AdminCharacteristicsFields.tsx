import { Form, Tag, Input } from 'antd';
import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { availableLocales } from '@eye8/shared/utils';

import { getFieldName } from '../../../utils';

const NameField = ({ input, meta, locale }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <Form.Item
      label={
        <>
          {intl.formatMessage({
            id: 'AdminCharacteristicValues.nameInput.label',
          })}
          <Tag>{locale}</Tag>
        </>
      }
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Input placeholder={intl.formatMessage({ id: 'AdminCharacteristicValues.nameInput.placeholder' })} {...input} />
    </Form.Item>
  );
};

export interface Props {
  nameFieldKey: string;
}

const AdminCharacteristicValuesFields = ({ nameFieldKey }: Props) => {
  return (
    <>
      {availableLocales.map((locale) => (
        <Field
          key={getFieldName(nameFieldKey, locale)}
          name={getFieldName(nameFieldKey, locale)}
          component={NameField}
          locale={locale}
        />
      ))}
    </>
  );
};

export default AdminCharacteristicValuesFields;
