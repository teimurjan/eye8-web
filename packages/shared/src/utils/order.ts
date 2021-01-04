import { IOrderItem } from '@eye8/api/order';
import { IProductListResponseItem } from '@eye8/api/product';
import { IPromoCodeListResponseItem } from '@eye8/api/promo-code';
import { isPromoCodeApplicableForProduct } from '@eye8/shared/helpers/promo-code';
import { calculateDiscountedPrice } from '@eye8/shared/utils';

type ValuableProductProps = Pick<IProductListResponseItem, 'id' | 'price' | 'discount'>;
type ValuablePromoCodeProps = Pick<IPromoCodeListResponseItem, 'products' | 'amount' | 'value' | 'discount'>;
type ProductCountGetter = (productId: number) => number;

export const getOrderTotalPrice = (items: IOrderItem[], promoCode?: ValuablePromoCodeProps) => {
  const products = items.map((item) => ({
    id: item.product ? item.product.id : NaN,
    price: item.product_price_per_item,
    discount: item.product_discount,
    quantity: item.quantity,
  }));

  const getProductCount = (productId: number) => {
    const product = products.find((product) => product.id === productId);
    return product ? product.quantity : 0;
  };

  return getCartTotalPrice(products, getProductCount, promoCode);
};

export const getCartTotalPrice = (
  products: ValuableProductProps[],
  getProductCount: ProductCountGetter,
  promoCode?: ValuablePromoCodeProps,
) => {
  if (promoCode && promoCode.products) {
    const promoCodeHasTarget_ = promoCode.products.length > 0;
    if (promoCodeHasTarget_) {
      return getTotalForTargetedPromoCode(products, getProductCount, promoCode);
    }

    return getTotalForUntargetedPromoCode(products, getProductCount, promoCode);
  }

  return getTotal(products, getProductCount);
};

const getTotalForTargetedPromoCode = (
  products: ValuableProductProps[],
  getProductCount: ProductCountGetter,
  promoCode: ValuablePromoCodeProps,
) => {
  return products.reduce((acc, product) => {
    const productCount = getProductCount(product.id);
    const promoCodeApplicableForProduct = isPromoCodeApplicableForProduct(promoCode.products, product);

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
  products: ValuableProductProps[],
  getProductCount: ProductCountGetter,
  promoCode: ValuablePromoCodeProps,
) => {
  const total = getTotal(products, getProductCount);
  return Math.max(
    calculateDiscountedPrice(total, promoCode.amount ? 0 : promoCode.discount) - (promoCode.amount ?? 0),
    0,
  );
};

const getTotal = (products: ValuableProductProps[], getProductCount: (productId: number) => number) => {
  return products.reduce((acc, product) => {
    const productCount = getProductCount(product.id);
    return acc + calculateDiscountedPrice(product.price, product.discount) * productCount;
  }, 0);
};
