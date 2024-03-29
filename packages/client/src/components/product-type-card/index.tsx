/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import classNames from 'classnames';
import { useTheme } from 'emotion-theming';
import React from 'react';
import { useIntl } from 'react-intl';

import { ProductType } from '@eye8/api';
import { Button, HelpText, Image, LinkPassingProps, Tag, Title } from '@eye8/client-ui';
import { useProductTypeSellingInfo } from '@eye8/client/hooks';
import { mediaQueries } from '@eye8/shared/styles';
import { formatMediaURL } from '@eye8/shared/utils';

export interface Props {
  productType: ProductType;
}

const ProductTypeCard = ({ productType }: Props) => {
  const theme = useTheme<ClientUITheme>();
  const intl = useIntl();
  const as = `/products/${productType.slug}`;
  const ref = React.useRef<HTMLAnchorElement>(null);
  const { price, discount, hasProducts, productInStock } = useProductTypeSellingInfo(productType);

  const buttonTextIntlId = React.useMemo(() => {
    if (productInStock) {
      return 'common.buy';
    }

    if (!hasProducts) {
      return 'ProductPage.notInStock';
    }

    return 'ProductPage.sold';
  }, [hasProducts, productInStock]);

  const image = formatMediaURL(productType.image ? productType.image : productType.products[0]?.images[0]);

  return (
    <LinkPassingProps
      ref={ref}
      css={css`
        color: unset;
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: column;
        transition: box-shadow 300ms;

        &.not-in-stock {
          opacity: 0.5;
        }
      `}
      className={classNames({ 'not-in-stock': !productInStock, 'price-unknown': !price })}
      href="/products/[slug]"
      as={as}
      passHref
    >
      <Image src={image} alt={productType.name} />
      <div
        css={css`
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 0 5px;
        `}
      >
        <Title
          css={css`
            margin: 10px 0 0 0;
          `}
          size={6}
          tag={3}
        >
          {productType.name}
        </Title>
        <HelpText
          css={css`
            margin: 0 0 10px 0;
          `}
        >
          {productType.products && productType.products.length > 1
            ? intl.formatMessage({ id: 'ProductType.someOptionsAvailable' })
            : null}
        </HelpText>
      </div>
      <Button
        css={css`
          width: 100% !important;
          margin-top: auto;

          @media ${mediaQueries.maxWidth768} {
            height: 48px;
          }
        `}
      >
        <span
          css={css`
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 15px;

            .price-unknown & {
              justify-content: center;
            }

            @media ${mediaQueries.maxWidth768} {
              flex-direction: column;
            }
          `}
        >
          <span>{intl.formatMessage({ id: buttonTextIntlId })}</span>
          {price && (
            <>
              <span
                css={css`
                  &::after {
                    content: '|';
                  }

                  @media ${mediaQueries.maxWidth768} {
                    &::after {
                      content: '';
                      margin: 5px 0 2.5px 0;
                      height: 1px;
                      background: ${theme.borderColor};
                      width: 80px;
                      display: block;
                    }
                  }
                `}
              ></span>
              <span
                css={css`
                  color: ${theme.textColor};

                  button:hover &,
                  button:focus & {
                    color: inherit;
                  }

                  .not-in-stock & {
                    color: ${theme.textSecondaryColor};
                  }

                  del {
                    font-size: 14px;
                    color: ${theme.textSecondaryColor};
                  }

                  @media ${mediaQueries.maxWidth768} {
                    font-size: 12px;

                    del {
                      font-size: 10px;
                    }
                  }
                `}
              >
                {price}
              </span>
            </>
          )}
        </span>
      </Button>
      {discount && (
        <Tag
          css={css`
            position: absolute;
            top: 10px;
            right: 10px;
          `}
        >
          {discount}
        </Tag>
      )}
    </LinkPassingProps>
  );
};

export default ProductTypeCard;
