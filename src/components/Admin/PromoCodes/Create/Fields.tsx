import * as React from 'react';
import { Field as FinalFormField, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { IProductListResponseItem } from 'src/api/ProductAPI';
import { Checkbox } from 'src/components/admin-ui/Checkbox/Checkbox';
import { Control } from 'src/components/admin-ui/Control/Control';
import { Field } from 'src/components/admin-ui/Field/Field';
import { FormCheckboxField } from 'src/components/admin-ui/FormCheckboxField/FormCheckboxField';
import { FormTextField } from 'src/components/admin-ui/FormTextField/FormTextField';
import { HelpText } from 'src/components/admin-ui/HelpText/HelpText';
import { Label } from 'src/components/admin-ui/Label/Label';
import { ProductsSelect } from 'src/components/Admin/ProductsSelect/ProductsSelect';

const DiscountField = ({ input, meta, disabled }: FieldRenderProps<string>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminPromoCodes.discount' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        disabled: disabled,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const AmountField = ({ input, meta, disabled }: FieldRenderProps<string>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminPromoCodes.amount' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        disabled: disabled,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const ValueField = ({ input, meta, disabled }: FieldRenderProps<string>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminPromoCodes.value' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
        disabled: disabled,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const IsActiveField = ({ input, meta }: FieldRenderProps<boolean>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <FormCheckboxField
      checkboxProps={{
        checked: input.value,
        onChange: () => input.onChange(!input.value),
        label: intl.formatMessage({ id: 'AdminPromoCodes.active' }),
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const DisableOnUseField = ({ input, meta }: FieldRenderProps<boolean>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <FormCheckboxField
      checkboxProps={{
        checked: input.value,
        onChange: () => input.onChange(!input.value),
        label: intl.formatMessage({ id: 'AdminPromoCodes.disableOnUse' }),
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const ProductsField = ({ input, meta }: FieldRenderProps<IProductListResponseItem[]>) => {
  const intl = useIntl();

  const [isAllSet, setAllSet] = React.useState(input.value.length === 0);

  const showError = meta.touched && meta.error;

  return (
    <Field>
      <Label>{intl.formatMessage({ id: 'AdminPromoCodes.products' })}</Label>
      <Control>
        <Checkbox
          checked={isAllSet}
          value={isAllSet.toString()}
          onChange={() => {
            input.onChange([]);
            setAllSet(!isAllSet);
          }}
          label={intl.formatMessage({ id: 'AdminPromoCodes.allProducts.label' })}
        />
      </Control>

      <ProductsSelect products={input.value || []} onChange={input.onChange} allowAddition={!isAllSet} />

      <HelpText type="is-danger">{showError ? intl.formatMessage({ id: meta.error }) : undefined}</HelpText>
    </Field>
  );
};

interface IProps {
  isEdit?: boolean;
}

export const Fields: React.SFC<IProps> = ({ isEdit }) => {
  return (
    <React.Fragment>
      <FinalFormField key="value" name="value" component={ValueField} disabled={isEdit} />
      <FinalFormField key="discount" name="discount" component={DiscountField} disabled={isEdit} />
      <FinalFormField key="amount" name="amount" component={AmountField} disabled={isEdit} />
      <FinalFormField key="disableOnUse" name="disableOnUse" component={DisableOnUseField} />
      <FinalFormField key="isActive" name="isActive" component={IsActiveField} />
      <FinalFormField key="products" name="products" render={ProductsField} />
    </React.Fragment>
  );
};
