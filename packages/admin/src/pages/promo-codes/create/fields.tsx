import React, { useCallback } from 'react';
import { Field as FinalFormField, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Checkbox, Control, Field, FormCheckboxField, FormTextField, HelpText, Label } from '@eye8/admin-ui';
import { Product } from '@eye8/api';

import { ProductSelect } from '../../../components';

const DiscountField = ({ input, meta, disabled }: FieldRenderProps<string>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: `${intl.formatMessage({ id: 'common.discount' })} (%)`,
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

const ProductsField = ({ input, meta }: FieldRenderProps<Product[]>) => {
  const intl = useIntl();

  const [isAllSet, setAllSet] = React.useState(input.value.length === 0);

  const showError = meta.touched && meta.error;

  const onProductChange = useCallback(
    (product: Product | undefined, index: number) => {
      if (Number.isNaN(index)) {
        const newValue = [...input.value, product];
        input.onChange(newValue);
      } else if (!product) {
        const newValue = input.value.filter((_, i) => i !== index);
        input.onChange(newValue);
      } else {
        const newValue = input.value.map((product_, i) => (i === index ? product : product_));
        input.onChange(newValue);
      }
    },
    [input],
  );

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

      {input.value.map((product, i) => (
        <ProductSelect value={product} onChange={(product) => onProductChange(product, i)} />
      ))}

      {!isAllSet && <ProductSelect value={undefined} onChange={(product) => onProductChange(product, NaN)} />}

      <HelpText type="is-danger">{showError ? intl.formatMessage({ id: meta.error }) : undefined}</HelpText>
    </Field>
  );
};

interface Props {
  isEdit?: boolean;
}

const Fields: React.SFC<Props> = ({ isEdit }) => {
  return (
    <React.Fragment>
      <FinalFormField key="value" name="value" component={ValueField} disabled={isEdit} />
      <FinalFormField key="discount" name="discount" component={DiscountField} disabled={isEdit} />
      <FinalFormField key="amount" name="amount" component={AmountField} disabled={isEdit} />
      <FinalFormField key="disableOnUse" name="disableOnUse" component={DisableOnUseField} />
      <FinalFormField key="isActive" name="isActive" component={IsActiveField} />
      <FinalFormField key="products" name="products" component={ProductsField} />
    </React.Fragment>
  );
};

export default Fields;
