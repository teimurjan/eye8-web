import { Form, Tag, Input, Select } from 'antd';
import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { FeatureType } from '@eye8/api';
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
            id: 'AdminFeatureValues.nameInput.label',
          })}
          <Tag>{locale}</Tag>
        </>
      }
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Input placeholder={intl.formatMessage({ id: 'AdminFeatureValues.nameInput.placeholder' })} {...input} />
    </Form.Item>
  );
};

const FeatureTypeSelect = ({ featureTypes, input, meta }: FieldRenderProps<string> & Pick<Props, 'featureTypes'>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  return ( 
    <Form.Item
      label={intl.formatMessage({
        id: 'AdminFeatureValues.featureTypeSelect.label',
      })}
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Select
        placeholder={intl.formatMessage({
          id: 'AdminFeatureValues.featureTypeSelect.defaultOption.title',
        })}
        {...input}
      >
        {featureTypes.map(({ id, name }) => (
          <Select.Option key={id} value={id}>
            {name[intl.locale]}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export interface Props {
  featureTypes: FeatureType<true>[];
  nameFieldKey: string;
}

const AdminFeatureValuesFields = ({ featureTypes, nameFieldKey }: Props) => {
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
      <Field key="feature_type_id" name="feature_type_id" component={FeatureTypeSelect} featureTypes={featureTypes} />
    </>
  );
};

export default AdminFeatureValuesFields;
