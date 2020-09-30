/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useTheme } from 'emotion-theming';
import { useIntl } from 'react-intl';

import { IProductListResponseItem } from 'src/api/ProductAPI';
import { IPromoCodeListResponseItem } from 'src/api/PromoCodeAPI';
import { HelpText } from 'src/components/client-ui/HelpText/HelpText';
import { Image } from 'src/components/client-ui/Image/Image';
import { Subtitle } from 'src/components/client-ui/Subtitle/Subtitle';
import { Title } from 'src/components/client-ui/Title/Title';
import { Quantity } from 'src/components/Client/Cart/CartItem/Quantity';
import { PriceCrossedText, PriceText } from 'src/components/Client/Price/Price';
import { isPromoCodeApplicableForProduct } from 'src/utils/promoCode';

interface IProps {
  product: IProductListResponseItem;
  count: number;
  onRemoveClick: () => void;
  onAddClick: () => void;
  promoCode?: IPromoCodeListResponseItem;
}

export const CartItem = ({ product, count, onRemoveClick, onAddClick, promoCode }: IProps) => {
  const theme = useTheme<ClientUITheme>();
  const intl = useIntl();

  console.log(promoCode?.products_ids, product);
  const promoCodeApplicable = promoCode ? isPromoCodeApplicableForProduct(promoCode.products_ids, product) : false;

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
