import * as React from 'react';

import { IProps as CheckboxProps, Checkbox } from 'src/components/admin-ui/Checkbox/Checkbox';
import { Control, IProps as ControlProps } from 'src/components/admin-ui/Control/Control';
import { Field, IProps as FieldProps } from 'src/components/admin-ui/Field/Field';
import { HelpText, IProps as HelpTextProps } from 'src/components/admin-ui/HelpText/HelpText';
import { IProps as LabelProps, Label } from 'src/components/admin-ui/Label/Label';

interface IProps {
  controlProps?: ControlProps;
  fieldProps?: FieldProps;
  helpTextProps?: HelpTextProps;
  checkboxProps: CheckboxProps;
  labelProps?: LabelProps;
}

export const FormCheckboxField = ({
  controlProps = {},
  fieldProps = {},
  labelProps = {},
  helpTextProps = {},
  checkboxProps = {},
}: IProps) => {
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
