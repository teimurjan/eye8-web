import React from 'react';

import { BannerListResponseItem } from '@eye8/api/banner';
import { ProductTypeListResponseItem } from '@eye8/api/product-type';
import { BannerService } from '@eye8/service/banner';
import { ProductTypeService } from '@eye8/service/product-type';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

export interface Props {
  View: React.ComponentType<ViewProps>;
  bannerService: BannerService;
  productTypeService: ProductTypeService;
  initialProps?: {
    banners: { [key: string]: BannerListResponseItem };
    productTypes: { [key: string]: ProductTypeListResponseItem };
    bannersOrder: number[];
    productTypesOrder: number[];
    error: string | undefined;
  };
}

export interface ViewProps {
  banners: BannerListResponseItem[];
  productTypes: ProductTypeListResponseItem[];
  error?: string;
}

export const HomePresenter: React.FC<Props> = ({ View, bannerService, productTypeService, initialProps }) => {
  const [bannersData, setBannersData] = React.useState<{
    entities: { [key: number]: BannerListResponseItem };
    order: number[];
  }>({ entities: initialProps?.banners ?? {}, order: initialProps?.bannersOrder ?? [] });
  const [productTypesData, setProductTypesData] = React.useState<{
    entities: { [key: number]: ProductTypeListResponseItem };
    order: number[];
  }>({ entities: initialProps?.productTypes ?? {}, order: initialProps?.productTypesOrder ?? [] });
  const [error, setError] = React.useState<string | undefined>(initialProps ? initialProps.error : undefined);

  React.useEffect(() => {
    if (initialProps) {
      return;
    }

    (async () => {
      try {
        const {
          entities: { banners },
          result: bannersOrder,
        } = await bannerService.getAll();
        setBannersData({ entities: banners, order: bannersOrder });
        const {
          entities: { productTypes },
          result: productTypesOrder,
        } = await productTypeService.getNewest();
        setProductTypesData({ entities: productTypes, order: productTypesOrder });
      } catch (e) {
        setError('errors.common');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View
      banners={agregateOrderedMapToArray(bannersData.entities, bannersData.order)}
      productTypes={agregateOrderedMapToArray(productTypesData.entities, productTypesData.order)}
      error={error}
    />
  );
};
