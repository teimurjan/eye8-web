/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import React from 'react';
import { Field as FinalFormField, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';

import { Field, FormPhoneField, FormSelectField, FormTextField, HelpText, Label, SelectTrigger } from '@eye8/admin-ui';
import { ProductsSelectItem } from '@eye8/admin/components/product-select-item';
import { ProductSelectContainer } from '@eye8/admin/components/product-select/container';
import { OrderListResponseItem } from '@eye8/api/order';
import { CartItemQuantity, PriceText } from '@eye8/client/components';
import { getOrderTotalPrice, parsePhoneNumber } from '@eye8/shared/utils';

const UserNameField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminOrders.userName' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const UserAddressField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminOrders.userAddress' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const PromoCodeField = ({ input, meta }: FieldRenderProps<string>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  return (
    <FormTextField
      labelProps={{
        children: intl.formatMessage({ id: 'AdminOrders.promoCode' }),
      }}
      inputProps={{
        ...input,
        isDanger: showError,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const StatusSelectField = ({ input, meta }: FieldRenderProps<string>) => {
  const showError = meta.touched && meta.error;

  const intl = useIntl();

  return (
    <FormSelectField
      labelProps={{
        children: intl.formatMessage({
          id: 'AdminOrders.statusSelect.label',
        }),
      }}
      selectProps={{
        ...input,
        options: [
          {
            title: 'idle',
            value: 'idle',
          },
          {
            title: 'approved',
            value: 'approved',
          },
          {
            title: 'completed',
            value: 'completed',
          },
          {
            title: 'rejected',
            value: 'rejected',
          },
        ],
        TriggerComponent: SelectTrigger,
      }}
      helpTextProps={{
        children: showError ? intl.formatMessage({ id: meta.error }) : undefined,
        type: 'is-danger',
      }}
    />
  );
};

const OrderItemsField = ({
  input,
  meta,
  promo_code_amount: promoCodeAmount,
  promo_code_discount: promoCodeDiscount,
  promo_code_products: promoCodeProductsIds,
  promo_code_value: promoCodeValue,
}: FieldRenderProps<OrderListResponseItem['items']> & FieldsProps) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  const setOrderItem = React.useCallback(
    (id: number, orderItem: OrderListResponseItem['items'][0]) => {
      input.onChange(input.value.map((orderItem_) => (orderItem_.id === id ? orderItem : orderItem_)));
    },
    [input],
  );

  const removeOrderItem = React.useCallback(
    (orderItem: OrderListResponseItem['items'][0]) => {
      input.onChange(input.value.filter((orderItem_) => orderItem_.id !== orderItem.id));
    },
    [input],
  );

  const addOrderItem = React.useCallback(
    (orderItem: OrderListResponseItem['items'][0]) => {
      const itemWithProduct = input.value.find(
        (orderItem_) => orderItem_.product && orderItem.product && orderItem_.product.id === orderItem.product.id,
      );

      if (itemWithProduct) {
        setOrderItem(itemWithProduct.id, { ...itemWithProduct, quantity: itemWithProduct.quantity + 1 });
      } else {
        input.onChange([...input.value, orderItem]);
      }
    },
    [setOrderItem, input],
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

  return (
    <Field>
      <Label>{intl.formatMessage({ id: 'AdminOrders.items' })}</Label>
      {input.value ? (
        <div>
          {input.value.map((orderItem) => (
            <ProductsSelectItem
              key={orderItem.id}
              id={orderItem.product?.id}
              name={
                orderItem.product ? orderItem.product.product_type.name : intl.formatMessage({ id: 'common.deleted' })
              }
              onChange={(product) =>
                setOrderItem(orderItem.id, {
                  id: NaN,
                  product_price_per_item: product.price,
                  product_discount: product.discount,
                  product,
                  quantity: 1,
                })
              }
              footer={
                <CartItemQuantity
                  count={orderItem.quantity}
                  allowedCount={orderItem.product ? orderItem.product.quantity : 0}
                  onAddClick={() => setOrderItem(orderItem.id, { ...orderItem, quantity: orderItem.quantity + 1 })}
                  onRemoveClick={() =>
                    orderItem.quantity === 1
                      ? removeOrderItem(orderItem)
                      : setOrderItem(orderItem.id, { ...orderItem, quantity: orderItem.quantity - 1 })
                  }
                />
              }
            />
          ))}
        </div>
      ) : null}
      <ProductSelectContainer
        css={css`
          margin: 10px 0;
        `}
        placeholder={intl.formatMessage({ id: 'AdminOrders.newProduct.placeholder' })}
        onChange={(product) => {
          addOrderItem({
            id: NaN,
            product_price_per_item: product.price,
            product_discount: product.discount,
            product,
            quantity: 1,
          });
        }}
      />
      <div>
        {intl.formatMessage({ id: 'Cart.total' })}: <PriceText price={totalPrice} />
      </div>
      <HelpText type="is-danger">{showError ? intl.formatMessage({ id: meta.error }) : undefined}</HelpText>
    </Field>
  );
};

type FieldsProps = Pick<
  OrderListResponseItem,
  'promo_code_amount' | 'promo_code_discount' | 'promo_code_products' | 'promo_code_value'
>;

export const Fields = (promoCodeProps: FieldsProps) => {
  const intl = useIntl();

  return (
    <React.Fragment>
      <FinalFormField key="user_name" name="user_name" component={UserNameField} />
      <FinalFormField
        key="user_phone_number"
        name="user_phone_number"
        component={FormPhoneField}
        parse={parsePhoneNumber}
        label={intl.formatMessage({ id: 'AdminOrders.userPhoneNumber' })}
      />
      <FinalFormField key="user_address" name="user_address" component={UserAddressField} />
      <FinalFormField key="items" name="items" component={OrderItemsField} {...promoCodeProps} />
      <FinalFormField key="promo_code" name="promo_code" component={PromoCodeField} />
      <FinalFormField key="status" name="status" component={StatusSelectField} />
    </React.Fragment>
  );
};
