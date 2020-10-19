/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import * as React from 'react';
import { useIntl } from 'react-intl';

import { IProductListResponseItem } from 'src/api/ProductAPI';
import { Button } from 'src/components/admin-ui/Button/Button';
import { ProductsSelectItem } from 'src/components/admin/ProductsSelect/ProductsSelectItem';
import { ProductSelectContainer } from 'src/components/common-ui/ProductSelect/ProductSelectContainer';

interface IProps {
  products: IProductListResponseItem[];
  onChange: (products: IProductListResponseItem[]) => void;
  allowAddition?: boolean;
}

export const ProductsSelect = ({ products, onChange, allowAddition = true }: IProps) => {
  const intl = useIntl();

  const setProduct = React.useCallback(
    (product: IProductListResponseItem) => {
      onChange(products.map((product_) => (product_.id === product.id ? product : product_)));
    },
    [onChange, products],
  );

  const removeProduct = React.useCallback(
    (product: IProductListResponseItem) => {
      onChange(products.filter((product_) => product_.id !== product.id));
    },
    [onChange, products],
  );

  const addProduct = React.useCallback(
    (product: IProductListResponseItem) => {
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
