
import { css } from '@emotion/react';
import { useTheme } from '@emotion/react';
import classNames from 'classnames';

import { ProductType } from '@eye8/api';
import { LinkPassingProps, Subtitle } from '@eye8/client-ui';
import { useProductTypeSellingInfo } from '@eye8/client/hooks';
import { Popover } from '@eye8/shared/components';
import { formatMediaURL } from '@eye8/shared/utils';

interface Props {
  productType: ProductType;
}

const SearchProductTypeItem = ({ productType }: Props) => {
  const theme = useTheme() as ClientUITheme;
  const { price, productInStock } = useProductTypeSellingInfo(productType);

  return (
    <Popover.Item
      Component={LinkPassingProps}
      key={productType.id}
      as={`/products/${productType.slug}`}
      href="/products/[slug]"
      css={css`
        overflow: hidden;
        text-overflow: ellipsis;
        display: flex;
        align-items: center;
      `}
      className={classNames({ 'not-in-stock': !productInStock })}
    >
      <img
        alt={productType.name}
        css={css`
          width: 50px;
          height: 50px;
          margin-right: 12px;
        `}
        src={formatMediaURL(productType.image)}
      />{' '}
      <div
        css={css`
          flex: 1;
          display: flex;
          justify-content: space-between;
        `}
      >
        <Subtitle size={5}>{productType.name}</Subtitle>
        <Subtitle
          size={5}
          css={css`
            text-align: right;
            color: ${theme.textColor};

            .not-in-stock & {
              color: ${theme.textSecondaryColor};
            }

            del {
              font-size: 14px;
              color: ${theme.textSecondaryColor};
            }
          `}
        >
          {price}
        </Subtitle>
      </div>
    </Popover.Item>
  );
};

export default SearchProductTypeItem;
