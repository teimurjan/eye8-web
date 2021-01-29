import React from 'react';

import { ProductListResponseItem } from '@eye8/api/product';
import { ProductTypeDetailResponseItem } from '@eye8/api/product-type';
import { ProductService } from '@eye8/service/product';
import { ProductTypeService } from '@eye8/service/product-type';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

export interface Props {
  View: React.ComponentType<ViewProps>;
  productTypeService: ProductTypeService;
  productService: ProductService;
  id?: number;
  actionText: string;
  action?: (product: ProductListResponseItem) => void;
  initialProps?: {
    productType: ProductTypeDetailResponseItem | null;
    products: ProductListResponseItem[];
    error?: string;
  };
}

export interface ViewProps {
  productType: ProductTypeDetailResponseItem | null;
  products: ProductListResponseItem[];
  error: string | undefined;
  isLoading: boolean;
  action: Props['action'];
  actionText: Props['actionText'];
}

const ProductTypePagePresenter: React.FC<Props> = ({
  View,
  productService,
  productTypeService,
  id,
  action,
  actionText,
  initialProps,
}) => {
  const [error, setError] = React.useState<string | undefined>(initialProps ? initialProps.error : undefined);
  const [isLoading, setLoading] = React.useState<boolean>(initialProps ? false : true);
  const [productType, setProductType] = React.useState<null | ProductTypeDetailResponseItem>(
    initialProps ? initialProps.productType : null,
  );
  const [products, setProducts] = React.useState<ProductListResponseItem[]>(initialProps ? initialProps.products : []);

  React.useEffect(() => {
    if (initialProps && !initialProps.productType) {
      setError('ProductPage.notFound');
    } else if (id && !initialProps) {
      (async () => {
        try {
          const productType = await productTypeService.getByID(id);
          if (productType) {
            const {
              entities: { products },
              result: productsOrder,
            } = await productService.getForProductType(productType.id);
            setProductType(productType);
            setProducts(agregateOrderedMapToArray(products, productsOrder));
          } else {
            setError('ProductPage.notFound');
          }
        } catch (e) {
          setError('errors.common');
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // When searching on product type page initialProps are changing and needed to be set to state
  React.useEffect(() => {
    if (initialProps) {
      setError(initialProps.error);
      setProductType(initialProps.productType);
      setProducts(initialProps.products);
    }
  }, [initialProps]);

  return (
    <View
      actionText={actionText}
      action={action}
      isLoading={isLoading}
      productType={productType}
      products={products}
      error={error}
    />
  );
};

export default ProductTypePagePresenter;
