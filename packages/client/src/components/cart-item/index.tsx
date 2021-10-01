
import { css, useTheme  } from '@emotion/react';
import { useIntl } from 'react-intl';

import { Product, PromoCode } from '@eye8/api';
import { HelpText, Image, Subtitle, Title } from '@eye8/client-ui';
import { isPromoCodeApplicableForProduct } from '@eye8/shared/helpers';

import Quantity from '../cart-item-quantity';
import { PriceCrossedText, PriceText } from '../price';

interface Props {
  product: Product;
  count: number;
  onRemoveClick: () => void;
  onAddClick: () => void;
  promoCode?: PromoCode;
}

const CartItem = ({ product, count, onRemoveClick, onAddClick, promoCode }: Props) => {
  const theme = useTheme() as ClientUITheme;
  const intl = useIntl();

  const promoCodeApplicable = promoCode ? isPromoCodeApplicableForProduct(promoCode.products, product) : false;

  return (
    <div
      css={css`
        padding: 10px 0;
        margin: 10px 0;
        border-bottom: 1px solid ${theme.borderColor};
      `}
    >
      <div
        css={css`
          display: flex;
        `}
      >
        <Image
          css={css`
            height: 50px;
            flex: 0 0 50px;
          `}
          src={product.images[0] || product.product_type.image}
          alt={product.product_type.name}
        />
        <div
          css={css`
            padding-left: 15px;
          `}
        >
          <Title size={6}>{product.product_type.name}</Title>
          <Subtitle size={6}>{product.feature_values.map((featureValue) => featureValue.name).join(', ')}</Subtitle>
        </div>
        <div
          css={css`
            margin-left: auto;
            text-align: right;
          `}
        >
          <Title size={6}>
            <PriceCrossedText
              price={product.price}
              discount={[product.discount, promoCode && promoCodeApplicable ? promoCode.discount : 0]}
            />
          </Title>
        </div>
      </div>
      <Quantity count={count} allowedCount={product.quantity} onAddClick={onAddClick} onRemoveClick={onRemoveClick} />
      {promoCode && promoCodeApplicable && (
        <HelpText color={HelpText.Color.Success}>
          {intl.formatMessage(
            { id: 'Cart.promoCodeApplied' },
            {
              value: promoCode.value.toUpperCase(),
              discount: () =>
                promoCode.amount ? (
                  <PriceText key={promoCode.id} price={promoCode.amount} />
                ) : (
                  <>{promoCode.discount}%</>
                ),
            },
          )}
        </HelpText>
      )}
      {promoCode && !promoCodeApplicable && (
        <HelpText color={HelpText.Color.Danger}>
          {intl.formatMessage({ id: 'Cart.promoCodeNotApplicable' }, { value: promoCode.value.toUpperCase() })}
        </HelpText>
      )}
    </div>
  );
};

export default CartItem;
