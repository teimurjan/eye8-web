import { PromoCode } from '@eye8/api';

export const isPromoCodeApplicableForProduct = (
  promoCodeProductsIds: PromoCode['products'],
  product: { id: number },
) => {
  return (
    typeof promoCodeProductsIds === 'undefined' ||
    promoCodeProductsIds.length === 0 ||
    (promoCodeProductsIds.length > 0 && promoCodeProductsIds.some((productId) => product.id === productId))
  );
};
