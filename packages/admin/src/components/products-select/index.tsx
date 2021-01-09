/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from 'react';
import { useIntl } from 'react-intl';

import { Button } from '@eye8/admin-ui';
import { ProductsSelectItem } from '@eye8/admin/components/product-select-item';
import { ProductSelectContainer } from '@eye8/admin/components/product-select/container';
import { ProductListResponseItem } from '@eye8/api/product';

interface Props {
  products: ProductListResponseItem[];
  onChange: (products: ProductListResponseItem[]) => void;
  allowAddition?: boolean;
}

export const ProductsSelect = ({ products, onChange, allowAddition = true }: Props) => {
  const intl = useIntl();

  const setProduct = React.useCallback(
    (product: ProductListResponseItem) => {
      onChange(products.map((product_) => (product_.id === product.id ? product : product_)));
    },
    [onChange, products],
  );

  const removeProduct = React.useCallback(
    (product: ProductListResponseItem) => {
      onChange(products.filter((product_) => product_.id !== product.id));
    },
    [onChange, products],
  );

  const addProduct = React.useCallback(
    (product: ProductListResponseItem) => {
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
