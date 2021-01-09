import React from 'react';

import {
  CheckboxProps,
  Checkbox,
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
  checkboxProps: CheckboxProps;
  labelProps?: LabelProps;
}

const FormCheckboxField = ({
  controlProps = {},
  fieldProps = {},
  labelProps = {},
  helpTextProps = {},
  checkboxProps = {},
}: Props) => {
  return (
    <Field {...fieldProps}>
      <Label {...labelProps} />
      <Control {...controlProps}>
        <Checkbox {...checkboxProps} />
      </Control>
      <HelpText {...helpTextProps} />
    </Field>
  );
};

export default FormCheckboxField;
