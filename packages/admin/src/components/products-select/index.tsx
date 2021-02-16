/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import { useIntl } from 'react-intl';

import { Button } from '@eye8/admin-ui';
import { Product } from '@eye8/api';

import ProductsSelectItem from '../product-select-item';
import ProductSelectContainer from '../product-select/container';

interface Props {
  products: Product[];
  onChange: (products: Product[]) => void;
  allowAddition?: boolean;
}

const ProductsSelect = ({ products, onChange, allowAddition = true }: Props) => {
  const intl = useIntl();

  const setProduct = React.useCallback(
    (product: Product) => {
      onChange(products.map((product_) => (product_.id === product.id ? product : product_)));
    },
    [onChange, products],
  );

  const removeProduct = React.useCallback(
    (product: Product) => {
      onChange(products.filter((product_) => product_.id !== product.id));
    },
    [onChange, products],
  );

  const addProduct = React.useCallback(
    (product: Product) => {
      onChange([...products, product]);
    },
    [onChange, products],
  );

  return (
    <div>
      {products.map((product) => (
        <ProductsSelectItem
          id={product.id}
          key={product.id}
          name={product.product_type.name}
          onChange={setProduct}
          footer={
            <Button color="is-danger" onClick={() => removeProduct(product)}>
              {intl.formatMessage({ id: 'common.remove' })}
            </Button>
          }
        />
      ))}

      {allowAddition && (
        <ProductSelectContainer
          css={css`
            margin: 10px 0;
          `}
          placeholder={intl.formatMessage({ id: 'AdminOrders.newProduct.placeholder' })}
          onChange={addProduct}
        />
      )}
    </div>
  );
};

export default ProductsSelect;
