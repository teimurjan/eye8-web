import { IOrderItem } from 'src/api/OrderAPI';
import { calculateDiscountedPrice } from 'src/utils/number';
import { isPromoCodeApplicableForProduct, promoCodeHasTarget } from 'src/utils/promoCode';

interface IProduct {
  id: number;
  price: number;
  discount: number;
}

interface IPromoCode {
  id: number;
  value: string;
  discount: number;
  amount?: number;
  products?: Array<{ id: number; price: number; quantity: number; discount?: number }>;
}

export const getOrderTotalPrice = (items: IOrderItem[], promoCode?: IPromoCode) => {
  const products = items.map(item => ({
    id: item.product ? item.product.id : NaN,
    price: item.product_price_per_item,
    discount: item.product_discount,
    quantity: item.quantity,
  }));

  const getProductCount = (productId: number) => products.find(product => product.id === productId)!.quantity;

  return getCartTotalPrice(products, getProductCount, promoCode);
};

export const getCartTotalPrice = (
  products: IProduct[],
  getProductCount: (productId: number) => number,
  promoCode?: IPromoCode,
) => {
  if (promoCode) {
    const promoCodeHasTarget_ = promoCodeHasTarget(promoCode);
    if (promoCodeHasTarget_) {
      return getTotalForTargetedPromoCode(products, getProductCount, promoCode);
    }

    return getTotalForUntargetedPromoCode(products, getProductCount, promoCode);
  }

  return getTotal(products, getProductCount);
};

const getTotalForTargetedPromoCode = (
  products: IProduct[],
  getProductCount: (productId: number) => number,
  promoCode: IPromoCode,
) => {
  return products.reduce((acc, product) => {
    const productCount = getProductCount(product.id);
    const promoCodeApplicableForProduct = isPromoCodeApplicableForProduct(promoCode, product);

    if (promoCodeApplicableForProduct) {
      const priceAfterAllDiscounts =
        calculateDiscountedPrice(product.price, [product.discount, promoCode.amount ? 0 : promoCode.discount]) -
        (promoCode.amount ?? 0);
      return acc + Math.max(priceAfterAllDiscounts, 0) * productCount;
    }

    return acc + calculateDiscountedPrice(product.price, product.discount) * productCount;
  }, 0);
};

const getTotalForUntargetedPromoCode = (
  products: IProduct[],
  getProductCount: (productId: number) => number,
  promoCode: IPromoCode,
) => {
  const total = getTotal(products, getProductCount);
  return Math.max(
    calculateDiscountedPrice(total, promoCode.amount ? 0 : promoCode.discount) - (promoCode.amount ?? 0),
    0,
  );
};

const getTotal = (products: IProduct[], getProductCount: (productId: number) => number) => {
  return products.reduce((acc, product) => {
    const productCount = getProductCount(product.id);
    return acc + calculateDiscountedPrice(product.price, product.discount) * productCount;
  }, 0);
};
