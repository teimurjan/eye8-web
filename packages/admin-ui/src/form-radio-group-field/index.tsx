import React from 'react';

import {
  RadioProps,
  Radio,
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
  radioPropsList: RadioProps[];
  labelProps?: LabelProps;
}

const FormRadioGroupField = ({
  controlProps = {},
  fieldProps = {},
  radioPropsList,
  labelProps = {},
  helpTextProps = {},
}: Props) => {
  return (
    <Field {...fieldProps}>
      <Label {...labelProps} />
      <Control {...controlProps}>
        {radioPropsList.map((radioProps) => (
          <Radio {...radioProps} />
        ))}
      </Control>
      <HelpText {...helpTextProps} />
    </Field>
  );
};

export default FormRadioGroupField;
