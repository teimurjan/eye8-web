import React from 'react';

import {
  IInputProps,
  Input,
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
  inputProps?: IInputProps;
  labelProps?: ILabelProps;
  renderInput?: () => React.ReactNode;
  allowValue?: (value: string) => boolean;
  addons?: React.ReactNode;
}

export default ({
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
