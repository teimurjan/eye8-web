import { Row, Col } from 'antd';
import React from 'react';

import { OrderItem } from '@eye8/api';

import ProductQuantity from '../product-quantity';
import ProductSelect from '../product-select';

interface Props {
  value?: OrderItem;
  onChange: (value: OrderItem) => void;
  onRemove: (value: OrderItem) => void;
}

const OrderItemSelect = ({ value, onChange, onRemove }: Props) => {
  return (
    <Row key={value?.id}>
      <Col span={12}>
        <ProductSelect
          value={value?.product?.id}
          onChange={(product) =>
            onChange({
              id: value?.id || product.id,
              product_price_per_item: product?.price ?? 0,
              product_discount: product?.discount ?? 0,
              product,
              quantity: 1,
            })
          }
        />
      </Col>

      {value?.product && (
        <Col span={12}>
          <ProductQuantity
            count={value.quantity}
            allowedCount={value.product ? value.product.quantity : 0}
            onAddClick={() => onChange({ ...value, quantity: value.quantity + 1 })}
            onRemoveClick={() =>
              value.quantity === 1 ? onRemove(value) : onChange({ ...value, quantity: value.quantity - 1 })
            }
          />
        </Col>
      )}
    </Row>
  );
};

export default OrderItemSelect;
