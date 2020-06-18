import * as React from 'react';
import { FieldRenderProps } from 'react-final-form';
import InputMask from 'react-input-mask';
import { useIntl } from 'react-intl';

import { FormTextField } from 'src/components/admin-ui/FormTextField/FormTextField';
import { Input } from 'src/components/admin-ui/Input/Input';

interface IProps {
  label: string;
}

export const FormPhoneField = ({ input, meta, label }: FieldRenderProps<string> & IProps) => {
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
