import React from 'react';

import {
  ICheckboxProps,
  Checkbox,
  IControlProps,
  Control,
  IFieldProps,
  Field,
  IHelpTextProps,
  HelpText,
  ILabelProps,
  Label,
} from '@eye8/admin-ui/index';

export interface IProps {
  controlProps?: IControlProps;
  fieldProps?: IFieldProps;
  helpTextProps?: IHelpTextProps;
  checkboxProps: ICheckboxProps;
  labelProps?: ILabelProps;
}

export default ({
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
