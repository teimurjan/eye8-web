import * as React from 'react';

import { IBannerListResponseItem } from 'src/api/BannerAPI';
import { IProductTypeListResponseItem } from 'src/api/ProductTypeAPI';
import { IBannerService } from 'src/services/BannerService';
import { IProductTypeService } from 'src/services/ProductTypeService';
import { IContextValue as AppStateContextValue } from 'src/state/AppState';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IProps extends AppStateContextValue {
  View: React.ComponentClass<IViewProps> | React.SFC<IViewProps>;
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
  activeBannerIndex: number;
}

export const HomePresenter: React.FC<IProps> = ({
  View,
  bannerService,
  productTypeService,
  appState,
  initialProps,
}) => {
  const [banners, setBanners] = React.useState<{ [key: string]: IBannerListResponseItem }>(
    initialProps ? initialProps.banners : {},
  );
  const [productTypes, setProductTypes] = React.useState<{ [key: string]: IProductTypeListResponseItem }>(
    initialProps ? initialProps.productTypes : {},
  );
  const [bannersOrder, setBannersOrder] = React.useState<number[]>(initialProps ? initialProps.bannersOrder : []);
  const [productTypesOrder, setProductTypesOrder] = React.useState<number[]>(
    initialProps ? initialProps.productTypesOrder : [],
  );
  const [error, setError] = React.useState<string | undefined>(initialProps ? initialProps.error : undefined);
  const [activeBannerIndex, setActiveBannerIndex] = React.useState(0);

  React.useEffect(() => {
    if (initialProps) {
      return;
    }

    (async () => {
      try {
        appState.setLoading();
        const {
          entities: { banners: _banners },
          result: _bannersOrder,
        } = await bannerService.getAll();
        setBanners(_banners);
        setBannersOrder(_bannersOrder);
        const {
          entities: { productTypes: _productTypes },
          result: _productTypesOrder,
        } = await productTypeService.getNewest();
        setProductTypes(_productTypes);
        setProductTypesOrder(_productTypesOrder);
      } catch (e) {
        setError('errors.common');
      } finally {
        appState.setIdle();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    const intervalID = setInterval(() => {
      const nextBannerIndex = activeBannerIndex < bannersOrder.length - 1 ? activeBannerIndex + 1 : 0;
      setActiveBannerIndex(nextBannerIndex);
    }, 5000);

    return () => clearInterval(intervalID);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeBannerIndex, bannersOrder.length]);

  return (
    <View
      banners={agregateOrderedMapToArray(banners, bannersOrder)}
      productTypes={agregateOrderedMapToArray(productTypes, productTypesOrder)}
      activeBannerIndex={activeBannerIndex}
      error={error}
    />
  );
};
