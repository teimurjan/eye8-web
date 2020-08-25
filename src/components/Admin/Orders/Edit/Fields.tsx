/** @jsx jsx */

import { css, jsx } from '@emotion/core';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Field as FinalFormField, FieldRenderProps } from 'react-final-form';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { IOrderDetailResponseItem } from 'src/api/OrderAPI';
import { Box } from 'src/components/admin-ui/Box/Box';
import { Field } from 'src/components/admin-ui/Field/Field';
import { FormPhoneField } from 'src/components/admin-ui/FormPhoneField/FormPhoneField';
import { FormSelectField } from 'src/components/admin-ui/FormSelectField/FormSelectField';
import { FormTextField } from 'src/components/admin-ui/FormTextField/FormTextField';
import { HelpText } from 'src/components/admin-ui/HelpText/HelpText';
import { Label } from 'src/components/admin-ui/Label/Label';
import { Subtitle } from 'src/components/admin-ui/Subtitle/Subtitle';
import { SearchableSelectTrigger } from 'src/components/admin-ui/Trigger/Trigger';
import { Quantity } from 'src/components/Client/Cart/CartItem/Quantity';
import { PriceText } from 'src/components/Client/Price/Price';
import { ProductSelectContainer } from 'src/components/common-ui/ProductSelect/ProductSelectContainer';
import { getOrderTotalPrice } from 'src/utils/order';
import { parsePhoneNumber } from 'src/utils/phone';

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
        TriggerComponent: SearchableSelectTrigger,
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
  promoCode,
}: FieldRenderProps<IOrderDetailResponseItem['items']> & Pick<IFieldsProps, 'promoCode'>) => {
  const intl = useIntl();

  const showError = meta.touched && meta.error;

  const setOrderItem = React.useCallback(
    (id: number, orderItem: IOrderDetailResponseItem['items'][0]) => {
      input.onChange(input.value.map((orderItem_) => (orderItem_.id === id ? orderItem : orderItem_)));
    },
    [input],
  );

  const removeOrderItem = React.useCallback(
    (orderItem: IOrderDetailResponseItem['items'][0]) => {
      input.onChange(input.value.filter((orderItem_) => orderItem_.id !== orderItem.id));
    },
    [input],
  );

  const addOrderItem = React.useCallback(
    (orderItem: IOrderDetailResponseItem['items'][0]) => {
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

  const totalPrice = input.value ? getOrderTotalPrice(input.value, promoCode) : 0;

  return (
    <Field>
      <Label>{intl.formatMessage({ id: 'AdminOrders.items' })}</Label>
      {input.value ? (
        <div
          css={css`
            display: flex;
          `}
        >
          {input.value.map((orderItem) => (
            <Box
              css={css`
                margin-bottom: 0 !important;
                margin-right: 10px;
                padding: 10px;
                flex: 0 0 25%;

                &:last-child {
                  margin-right: 0;
                }
              `}
              key={orderItem.id}
            >
              <div
                css={css`
                  display: flex;
                  flex-direction: column;
                `}
              >
                {orderItem.product && (
                  <Subtitle size={4}>
                    {orderItem.product.product_type.name}{' '}
                    <Link to={`/admin/products/edit/${orderItem.product.id}`}>
                      <FontAwesomeIcon
                        size="sm"
                        css={css`
                          margin-left: 5px;
                          display: inline-block;
                          vertical-align: baseline;
                        `}
                        icon={faExternalLinkAlt}
                      />
                    </Link>
                  </Subtitle>
                )}
                <ProductSelectContainer
                  placeholder={intl.formatMessage({ id: 'AdminOrders.anotherProduct.placeholder' })}
                  onChange={(product) => {
                    setOrderItem(orderItem.id, {
                      id: NaN,
                      product_price_per_item: product.price,
                      product_discount: product.discount,
                      product_upc: product.upc,
                      product,
                      quantity: 1,
                    });
                  }}
                />
              </div>
              <Quantity
                count={orderItem.quantity}
                allowedCount={orderItem.product ? orderItem.product.quantity : 0}
                onAddClick={() => setOrderItem(orderItem.id, { ...orderItem, quantity: orderItem.quantity + 1 })}
                onRemoveClick={() =>
                  orderItem.quantity === 1
                    ? removeOrderItem(orderItem)
                    : setOrderItem(orderItem.id, { ...orderItem, quantity: orderItem.quantity - 1 })
                }
              />
            </Box>
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
            product_upc: product.upc,
            product,
            quantity: 1,
          });
        }}
      />
      <div>
        {intl.formatMessage({ id: 'Cart.total' })}: <PriceText price={totalPrice} forceLocale="en" />
      </div>
      <HelpText type="is-danger">{showError ? intl.formatMessage({ id: meta.error }) : undefined}</HelpText>
    </Field>
  );
};

interface IFieldsProps {
  promoCode: IOrderDetailResponseItem['promo_code'];
}

export const Fields = ({ promoCode }: IFieldsProps) => {
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
      <FinalFormField key="items" name="items" render={OrderItemsField} promoCode={promoCode} />
      <FinalFormField key="promo_code" name="promo_code" component={PromoCodeField} />
      <FinalFormField key="status" name="status" component={StatusSelectField} />
    </React.Fragment>
  );
};
