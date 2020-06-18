export const isPromoCodeApplicableForProduct = (
  promoCode: { products?: Array<{ id: number }> },
  product: { id: number },
) =>
  !promoCode.products ||
  promoCode.products.length === 0 ||
  promoCode.products.some(product_ => product.id === product_.id);
