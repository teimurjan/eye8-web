import { Form, Input, Select } from 'antd';
import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import InputMask from 'react-input-mask';
import { useIntl } from 'react-intl';

import { Order } from '@eye8/api';
import { PriceText } from '@eye8/client/components';
import { getOrderTotalPrice, parsePhoneNumber } from '@eye8/shared/utils';

import { ProductSelect, OrderItemSelect } from '../../../components';

const UserNameField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <Form.Item
      label={intl.formatMessage({
        id: 'AdminOrders.userName',
      })}
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Input {...input} />
    </Form.Item>
  );
};

const UserAddressField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <Form.Item
      label={intl.formatMessage({
        id: 'AdminOrders.userAddress',
      })}
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Input {...input} />
    </Form.Item>
  );
};

const PromoCodeField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <Form.Item
      label={intl.formatMessage({
        id: 'AdminOrders.promoCode',
      })}
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Input {...input} />
    </Form.Item>
  );
};

const PhoneField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <Form.Item
      label={intl.formatMessage({ id: 'AdminOrders.userPhoneNumber' })}
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <InputMask disabled={false} mask="+\9\96 (999) 99-99-99" {...input}>
        {(props: React.HTMLAttributes<HTMLInputElement>) => (
          <Input
            placeholder={intl.formatMessage({
              id: 'common.phoneInput.placeholder',
            })}
            disabled={false}
            {...props}
          />
        )}
      </InputMask>
    </Form.Item>
  );
};

const statuses = ['idle', 'approved', 'completed', 'rejected'];

const StatusSelectField = ({ input, meta }: FieldRenderProps<string>) => {
  const showError = meta.touched && meta.error;

  const intl = useIntl();

  return (
    <Form.Item
      label={intl.formatMessage({
        id: 'AdminOrders.statusSelect.label',
      })}
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      <Select
        placeholder={intl.formatMessage({
          id: 'AdminFeatureValues.featureTypeSelect.defaultOption.title',
        })}
        {...input}
      >
        {statuses.map((status) => (
          <Select.Option key={status} value={status}>
            {status}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

const OrderItemsField = ({
  input,
  meta,
  promo_code_amount: promoCodeAmount,
  promo_code_discount: promoCodeDiscount,
  promo_code_products: promoCodeProductsIds,
  promo_code_value: promoCodeValue,
}: FieldRenderProps<Order['items']> & Props) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  const onChange = React.useCallback(
    (newOrderItem: Order['items'][0]) => {
      const index = input.value.findIndex((orderItem) => orderItem.id === newOrderItem.id);
      if (index >= 0) {
        const newValue = [...input.value];
        newValue[index] = newOrderItem;
        console.log(newValue, index);
        input.onChange(newValue);
      }
    },
    [input],
  );

  const onRemove = React.useCallback(
    (newOrderItem: Order['items'][0]) => {
      const newValue = input.value.filter((orderItem) => orderItem.id !== newOrderItem.id);
      input.onChange(newValue);
    },
    [input],
  );

  const onAdd = React.useCallback(
    (newOrderItem: Order['items'][0]) => {
      const existinOrderItem = input.value.find(
        (orderItem) => orderItem.product && newOrderItem.product && orderItem.product.id === newOrderItem.product.id,
      );

      if (existinOrderItem) {
        onChange({ ...existinOrderItem, quantity: existinOrderItem.quantity + 1 });
      } else {
        input.onChange([...input.value, newOrderItem]);
      }
    },
    [onChange, input],
  );

  const totalPrice = input.value
    ? getOrderTotalPrice(
        input.value,
        promoCodeValue
          ? {
              amount: promoCodeAmount,
              discount: promoCodeDiscount ?? 0,
              products: promoCodeProductsIds,
              value: promoCodeValue,
            }
          : undefined,
      )
    : 0;

  console.log(input.value);

  return (
    <Form.Item
      label={intl.formatMessage({
        id: 'AdminOrders.items',
      })}
      help={showError ? intl.formatMessage({ id: meta.error }) : undefined}
      validateStatus={showError ? 'error' : undefined}
    >
      {input.value
        ? input.value.map((orderItem) => (
            <OrderItemSelect key={orderItem.id} value={orderItem} onChange={onChange} onRemove={onRemove} />
          ))
        : null}
      <OrderItemSelect key={input.value.length} value={undefined} onChange={onAdd} onRemove={onRemove} />
      <div>
        {intl.formatMessage({ id: 'Cart.total' })}: <PriceText price={totalPrice} />
      </div>
    </Form.Item>
  );
};

type Props = Pick<Order, 'promo_code_amount' | 'promo_code_discount' | 'promo_code_products' | 'promo_code_value'>;

const AdminOrdersFields = (props: Props) => {
  return (
    <React.Fragment>
      <Field key="user_name" name="user_name" component={UserNameField} />
      <Field key="user_phone_number" name="user_phone_number" component={PhoneField} parse={parsePhoneNumber} />
      <Field key="user_address" name="user_address" component={UserAddressField} />
      <Field key="items" name="items" component={OrderItemsField} {...props} />
      <Field key="promo_code" name="promo_code" component={PromoCodeField} />
      <Field key="status" name="status" component={StatusSelectField} />
    </React.Fragment>
  );
};

export default AdminOrdersFields;
