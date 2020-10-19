import * as React from 'react';

import { IBannerListResponseItem } from 'src/api/BannerAPI';
import { IProductTypeListResponseItem } from 'src/api/ProductTypeAPI';
import { IBannerService } from 'src/services/BannerService';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { IContextValue as AppStateContextValue } from 'src/state/AppState';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IProps extends AppStateContextValue {
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

export const HomePresenter: React.FC<IProps> = ({
  View,
  bannerService,
  productTypeService,
  appState,
  initialProps,
}) => {
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
        appState.setLoading();
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
      } finally {
        appState.setIdle();
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
