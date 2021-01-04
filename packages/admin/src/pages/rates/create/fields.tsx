/** @jsx jsx */

import { jsx } from '@emotion/core';
import React from 'react';
import { Field as FinalFormField, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { FormTextField } from '@eye8/admin-ui/index';

const ValueField = ({ input, meta, disabled }: FieldRenderProps<string>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminRates.value' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        disabled: disabled,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
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
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminRates.name' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        disabled: disabled,
        onChange,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

export const Fields: React.SFC = () => {
  return (
    <React.Fragment>
      <FinalFormField key="name" name="name" component={NameField} />
      <FinalFormField key="value" name="value" component={ValueField} />
    </React.Fragment>
  );
};
