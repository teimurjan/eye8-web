import React from 'react';

import { Banner } from '@eye8/api';
import { ProductType } from '@eye8/api';
import { BannerService } from '@eye8/service';
import { ProductTypeService } from '@eye8/service';
import { agregateOrderedMapToArray } from '@eye8/shared/utils';

export interface Props {
  View: React.ComponentType<ViewProps>;
  bannerService: BannerService;
  productTypeService: ProductTypeService;
  initialProps?: {
    banners: { [key: string]: Banner };
    productTypes: { [key: string]: ProductType };
    bannersOrder: number[];
    productTypesOrder: number[];
    error: string | undefined;
  };
}

export interface ViewProps {
  banners: Banner[];
  productTypes: ProductType[];
  error?: string;
}

const HomePresenter: React.FC<Props> = ({ View, bannerService, productTypeService, initialProps }) => {
  const [bannersData, setBannersData] = React.useState<{
    entities: { [key: number]: Banner };
    order: number[];
  }>({ entities: initialProps?.banners ?? {}, order: initialProps?.bannersOrder ?? [] });
  const [productTypesData, setProductTypesData] = React.useState<{
    entities: { [key: number]: ProductType };
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

export default HomePresenter;
