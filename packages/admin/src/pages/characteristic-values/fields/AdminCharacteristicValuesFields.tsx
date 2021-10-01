import { Form, Tag, Input, Select } from 'antd';
import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Characteristic } from '@eye8/api';
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

const CharacteristicSelect = ({
  characteristics,
  input,
  meta,
}: FieldRenderProps<string> & Pick<Props, 'characteristics'>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return (
    <Form.Item
      label={intl.formatMessage({
        id: 'AdminCharacteristicValues.characteristicSelect.label',
      })}
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Select
        placeholder={intl.formatMessage({
          id: 'AdminCharacteristicValues.characteristicSelect.defaultOption.title',
        })}
        {...input}
      >
        {characteristics.map(({ id, name }) => (
          <Select.Option key={id} value={id}>
            {name[intl.locale]}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export interface Props {
  characteristics: Characteristic<true>[];
  nameFieldKey: string;
}

const AdminCharacteristicValuesFields = ({ characteristics, nameFieldKey }: Props) => {
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
      <Field
        key="characteristic_id"
        name="characteristic_id"
        component={CharacteristicSelect}
        characteristics={characteristics}
      />
    </>
  );
};

export default AdminCharacteristicValuesFields;
