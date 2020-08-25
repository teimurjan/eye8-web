import * as React from 'react';

import { Control, IProps as ControlProps } from 'src/components/admin-ui/Control/Control';
import { Field, IProps as FieldProps } from 'src/components/admin-ui/Field/Field';
import { HelpText, IProps as HelpTextProps } from 'src/components/admin-ui/HelpText/HelpText';
import { Input, IProps as InputProps } from 'src/components/admin-ui/Input/Input';
import { IProps as LabelProps, Label } from 'src/components/admin-ui/Label/Label';

interface IProps {
  controlProps?: ControlProps;
  fieldProps?: FieldProps;
  helpTextProps?: HelpTextProps;
  inputProps?: InputProps;
  labelProps?: LabelProps;
  renderInput?: () => React.ReactNode;
  allowValue?: (value: string) => boolean;
  addons?: React.ReactNode;
}

export const FormTextField = ({
  controlProps = {},
  fieldProps = {},
  inputProps = {},
  labelProps = {},
  helpTextProps = {},
  allowValue,
  renderInput,
  addons,
}: IProps) => {
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
