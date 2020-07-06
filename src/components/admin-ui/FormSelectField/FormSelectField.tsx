import * as React from 'react';

import { Control, IProps as ControlProps } from 'src/components/admin-ui/Control/Control';
import { Field, IProps as FieldProps } from 'src/components/admin-ui/Field/Field';
import { HelpText, IProps as HelpTextProps } from 'src/components/admin-ui/HelpText/HelpText';
import { IProps as LabelProps, Label } from 'src/components/admin-ui/Label/Label';
import { IProps as SelectProps, Select } from 'src/components/client-ui/Select/Select';

interface IProps {
  controlProps?: ControlProps;
  fieldProps?: FieldProps;
  helpTextProps?: HelpTextProps;
  selectProps: {
    options: Array<{ title: string; value: string }>;
  } & Omit<SelectProps<HTMLDivElement>, 'children'>;
  labelProps?: LabelProps;
}

export const FormSelectField = ({
  controlProps = {},
  fieldProps = {},
  selectProps,
  labelProps = {},
  helpTextProps = {},
}: IProps) => {
  const { options, ...selectPropsToPass } = selectProps;

  const selectOptions = options.map(({ title, value }) => (
    <Select.Option key={value} value={value}>
      {title}
    </Select.Option>
  ));

  return (
    <Field {...fieldProps}>
      <Label {...labelProps} />
      <Control {...controlProps}>
        <Select {...selectPropsToPass}>{selectOptions}</Select>
      </Control>
      <HelpText {...helpTextProps} />
    </Field>
  );
};
