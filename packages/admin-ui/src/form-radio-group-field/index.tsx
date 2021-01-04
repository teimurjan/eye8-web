import React from 'react';

import {
  IRadioProps,
  Radio,
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
  radioPropsList: IRadioProps[];
  labelProps?: ILabelProps;
}

const Index = ({ controlProps = {}, fieldProps = {}, radioPropsList, labelProps = {}, helpTextProps = {} }: IProps) => {
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

export default Index;
