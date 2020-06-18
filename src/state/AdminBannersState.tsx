import * as React from 'react';

import { IBannerListRawIntlResponseItem } from 'src/api/BannerAPI';
import { useDependencies } from 'src/DI/DI';
import { extendIntlTextWithLocaleNames } from 'src/helpers/intl';
import { useIntlState } from 'src/state/IntlState';
import { agregateOrderedMapToArray } from 'src/utils/agregate';

export interface IContextValue {
  adminBannersState: {
    banners: IBannerListRawIntlResponseItem[];
    isListLoading: boolean;
    hasListLoaded: boolean;
    listError: undefined | string;
    getBanners: () => Promise<void>;
    deleteBanner: (id: number) => void;
    addBanner: (banner: IBannerListRawIntlResponseItem) => void;
    setBanner: (banner: IBannerListRawIntlResponseItem) => void;
  };
}

const Context = React.createContext<IContextValue | null>(null);

interface IProviderProps {
  children?: React.ReactNode;
}

export const AdminBannersStateProvider: React.SFC<IProviderProps> = ({ children }) => {
  const {
    intlState: { availableLocales },
  } = useIntlState();
  const {
    dependencies: {
      services: { banner: service },
    },
  } = useDependencies();

  const [banners, setBanners] = React.useState<{ [key: string]: IBannerListRawIntlResponseItem }>({});
  const [bannersOrder, setBannersOrder] = React.useState<number[]>([]);
  const [isListLoading, setListLoading] = React.useState(false);
  const [listError, setListError] = React.useState<undefined | string>(undefined);
  const [hasListLoaded, setListLoaded] = React.useState(false);

  const getBanners = React.useCallback(async () => {
    setListLoading(true);
    try {
      const { entities, result } = await service.getAllRawIntl();
      setBanners(entities.banners);
      setBannersOrder(result);
    } catch (e) {
      setListError('errors.common');
    } finally {
      setListLoading(false);
      setListLoaded(true);
    }
  }, [service]);

  const addBanner = React.useCallback(
    (banner: IBannerListRawIntlResponseItem) => {
      const newBanners = {
        ...banners,
        [banner.id]: banner,
      };

      const newBannersOrder = [...bannersOrder, banner.id];

      setBanners(newBanners);
      setBannersOrder(newBannersOrder);
    },
    [banners, bannersOrder],
  );

  const setBanner = React.useCallback(
    (banner: IBannerListRawIntlResponseItem) => {
      const newBanners = {
        ...banners,
        [banner.id]: banner,
      };

      setBanners(newBanners);
    },
    [banners],
  );

  const deleteBanner = React.useCallback(
    (id: number) => {
      const newBanners = { ...banners };
      delete newBanners[id];

      const newBannersOrder = bannersOrder.filter(idFromOrder => idFromOrder !== id);
      setBannersOrder(newBannersOrder);
      setBanners(newBanners);
    },
    [banners, bannersOrder],
  );

  return (
    <Context.Provider
      value={{
        adminBannersState: {
          addBanner,
          deleteBanner,
          banners: agregateOrderedMapToArray(banners, bannersOrder, banner => ({
            ...banner,
            text: extendIntlTextWithLocaleNames(banner.text, availableLocales),
          })),
          getBanners,
          hasListLoaded,
          isListLoading,
          listError,
          setBanner,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useAdminBannersState = () => React.useContext(Context) as IContextValue;
