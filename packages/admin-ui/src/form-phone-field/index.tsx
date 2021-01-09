import React from 'react';
import { FieldRenderProps } from 'react-final-form';
import InputMask from 'react-input-mask';
import { useIntl } from 'react-intl';

import { FormTextField, Input } from '@eye8/admin-ui';

export interface Props {
  label: string;
}

const FormPhoneField = ({ input, meta, label }: FieldRenderProps<string> & Props) => {
  const intl = useIntl();
  const showError = meta.touched && meta.error;
  const inputProps = {
    ...input,
    isDanger: showError,
    placeholder: intl.formatMessage({
      id: 'common.phoneInput.placeholder',
    }),
  };
  return (
    <FormTextField
      labelProps={{
        children: label || intl.formatMessage({ id: 'common.phoneInput.label' }),
      }}
      renderInput={() => (
        <InputMask disabled={false} mask="+\9\96 (999) 99-99-99" {...inputProps}>
          {(props: React.HTMLAttributes<HTMLInputElement>) => <Input disabled={false} {...props} />}
        </InputMask>
      )}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

export default FormPhoneField;
