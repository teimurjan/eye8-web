import React from 'react';

import {
  IControlProps,
  Control,
  IFieldProps,
  Field,
  IHelpTextProps,
  HelpText,
  ILabelProps,
  Label,
} from '@eye8/admin-ui/index';
import { ISelectProps, Select } from '@eye8/client-ui';

export interface IProps<M extends boolean> {
  controlProps?: IControlProps;
  fieldProps?: IFieldProps;
  helpTextProps?: IHelpTextProps;
  selectProps: {
    options: Array<{ title: string; value: string }>;
  } & Omit<ISelectProps<HTMLDivElement>, 'children'>;
  labelProps?: ILabelProps;
}

export default <M extends boolean>({
  controlProps = {},
  fieldProps = {},
  selectProps,
  labelProps = {},
  helpTextProps = {},
}: IProps<M>) => {
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
