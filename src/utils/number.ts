export const isStringNumber = (s: string) => parseInt(s, 10).toString() === s;
export const isAllowedForNumberInput = (s: string) => s.length === 0 || isStringNumber(s);

export const calculateDiscountedPrice = (price: number, discount: number | number[]) =>
  (Array.isArray(discount) ? discount : [discount]).reduce((acc, discount_) => acc - (acc * discount_) / 100, price);

export const calculatePromoCodePrice = (price: number, promoCode: { discount: number; amount?: number }) =>
  promoCode.amount ? price - promoCode.amount : calculateDiscountedPrice(price, promoCode.discount);

export const getCeiledPrice = (price: number) => Math.ceil(price / 100) * 100;
