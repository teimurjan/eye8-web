import React from 'react';

import { IProductListResponseItem } from '@eye8/api/product';
import { IProductTypeDetailResponseItem } from '@eye8/api/product-type';
import { IProductService } from '@eye8/service/product';
import { IProductTypeService } from '@eye8/service/product-type';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  productTypeService: IProductTypeService;
  productService: IProductService;
  id?: number;
  actionText: string;
  action?: (product: IProductListResponseItem) => void;
  initialProps?: {
    productType: IProductTypeDetailResponseItem | null;
    products: IProductListResponseItem[];
    error?: string;
  };
}

export interface IViewProps {
  productType: IProductTypeDetailResponseItem | null;
  products: IProductListResponseItem[];
  error: string | undefined;
  isLoading: boolean;
  action: IProps['action'];
  actionText: IProps['actionText'];
}

export const ProductTypePagePresenter: React.FC<IProps> = ({
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
  const [productType, setProductType] = React.useState<null | IProductTypeDetailResponseItem>(
    initialProps ? initialProps.productType : null,
  );
  const [products, setProducts] = React.useState<IProductListResponseItem[]>(initialProps ? initialProps.products : []);

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
