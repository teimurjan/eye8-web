import React from 'react';

import { IBannerListResponseItem } from '@eye8/api/banner';
import { IProductTypeListResponseItem } from '@eye8/api/product-type';
import { IBannerService } from '@eye8/service/banner';
import { IProductTypeService } from '@eye8/service/product-type';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

export interface IProps {
  View: React.ComponentType<IViewProps>;
  bannerService: IBannerService;
  productTypeService: IProductTypeService;
  initialProps?: {
    banners: { [key: string]: IBannerListResponseItem };
    productTypes: { [key: string]: IProductTypeListResponseItem };
    bannersOrder: number[];
    productTypesOrder: number[];
    error: string | undefined;
  };
}

export interface IViewProps {
  banners: IBannerListResponseItem[];
  productTypes: IProductTypeListResponseItem[];
  error?: string;
}

export const HomePresenter: React.FC<IProps> = ({ View, bannerService, productTypeService, initialProps }) => {
  const [bannersData, setBannersData] = React.useState<{
    entities: { [key: number]: IBannerListResponseItem };
    order: number[];
  }>({ entities: initialProps?.banners ?? {}, order: initialProps?.bannersOrder ?? [] });
  const [productTypesData, setProductTypesData] = React.useState<{
    entities: { [key: number]: IProductTypeListResponseItem };
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
