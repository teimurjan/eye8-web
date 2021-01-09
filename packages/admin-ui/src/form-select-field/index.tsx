import React from 'react';

import { ControlProps, Control, FieldProps, Field, HelpTextProps, HelpText, LabelProps, Label } from '@eye8/admin-ui';
import { SelectProps, Select } from '@eye8/shared/components';

export interface Props {
  controlProps?: ControlProps;
  fieldProps?: FieldProps;
  helpTextProps?: HelpTextProps;
  selectProps: {
    options: Array<{ title: string; value: string }>;
  } & Omit<SelectProps<HTMLDivElement>, 'children'>;
  labelProps?: LabelProps;
}

const FormSelectField = ({
  controlProps = {},
  fieldProps = {},
  selectProps,
  labelProps = {},
  helpTextProps = {},
}: Props) => {
  const { options, ...selectPropsToPass } = selectProps;

  const selectOptions = options.map(({ title, value }) => (
    <Select.Option key={value} value={value} name={title}>
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

export default FormSelectField;
