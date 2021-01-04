import { IPromoCodeListResponseItem } from '@eye8/api/promo-code';

export const isPromoCodeApplicableForProduct = (
  promoCodeProductsIds: IPromoCodeListResponseItem['products'],
  product: { id: number },
) => {
  return (
    typeof promoCodeProductsIds === 'undefined' ||
    promoCodeProductsIds.length === 0 ||
    (promoCodeProductsIds.length > 0 && promoCodeProductsIds.some((productId) => product.id === productId))
  );
};