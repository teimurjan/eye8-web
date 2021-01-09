import React from 'react';

import {
  InputProps,
  Input,
  ControlProps,
  Control,
  FieldProps,
  Field,
  HelpTextProps,
  HelpText,
  LabelProps,
  Label,
} from '@eye8/admin-ui';

export interface Props {
  controlProps?: ControlProps;
  fieldProps?: FieldProps;
  helpTextProps?: HelpTextProps;
  inputProps?: InputProps;
  labelProps?: LabelProps;
  renderInput?: () => React.ReactNode;
  allowValue?: (value: string) => boolean;
  addons?: React.ReactNode;
}

const FormTextField = ({
  controlProps = {},
  fieldProps = {},
  inputProps = {},
  labelProps = {},
  helpTextProps = {},
  allowValue,
  renderInput,
  addons,
}: Props) => {
  const onChange: React.ChangeEventHandler<HTMLInputElement> = React.useCallback(
    (e) => {
      if (allowValue && !allowValue(e.currentTarget.value)) {
        return;
      }
      inputProps.onChange && inputProps.onChange(e);
    },
    [allowValue, inputProps],
  );

  return (
    <Field {...fieldProps}>
      <Label {...labelProps} />
      <Control {...controlProps}>{renderInput ? renderInput() : <Input {...inputProps} onChange={onChange} />}</Control>
      {addons && <Control {...controlProps}>{addons}</Control>}
      <HelpText {...helpTextProps} />
    </Field>
  );
};

export default FormTextField;
