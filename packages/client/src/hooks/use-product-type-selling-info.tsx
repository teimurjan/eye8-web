import { ProductType } from '@eye8/api';
import { usePriceRangeText } from '@eye8/client/components';

const useProductTypeSellingInfo = (productType: ProductType) => {
  const { price, discount } = usePriceRangeText({ range: productType.products || [] });

  const hasProducts = (productType.products?.length || 0) > 0;
  const productInStock = productType.products?.some((product) => product.quantity > 0);

  return { price, discount, hasProducts, productInStock };
};

export default useProductTypeSellingInfo;
