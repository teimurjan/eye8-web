type PromoCode = number | { id: number };

export const isPromoCodeApplicableForProduct = (promoCode: { products?: PromoCode[] }, product: { id: number }) => {
  return (
    !promoCodeHasTarget(promoCode) ||
    promoCode.products!.some((productId) => product.id === (typeof productId === 'number' ? productId : product.id))
  );
};

export const promoCodeHasTarget = (promoCode: { products?: PromoCode[] }) =>
  Array.isArray(promoCode.products) && promoCode.products.length > 0;
