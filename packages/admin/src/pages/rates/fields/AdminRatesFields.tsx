
import { jsx } from '@emotion/react';
import { Form, Input } from 'antd';
import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

const ValueField = ({ input, meta, disabled }: FieldRenderProps<string>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <Form.Item
      label={intl.formatMessage({
        id: 'AdminRates.value',
      })}
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Input {...input} disabled={disabled} />
    </Form.Item>
  );
};

const NameField = ({ input, meta, disabled }: FieldRenderProps<string>) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;

  const onChange = React.useCallback(
    (e) => {
      const value = e.currentTarget.value;
      if (value.match(/^[A-z_]*$/)) {
        input.onChange(e);
      }
    },
    [input],
  );

  return (
    <Form.Item
      label={intl.formatMessage({
        id: 'AdminRates.name',
      })}
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Input {...input} disabled={disabled} onChange={onChange} />
    </Form.Item>
  );
};

const AdminRatesFields = () => {
  return (
    <React.Fragment>
      <Field key="name" name="name" component={NameField} />
      <Field key="value" name="value" component={ValueField} />
    </React.Fragment>
  );
};

export default AdminRatesFields;
