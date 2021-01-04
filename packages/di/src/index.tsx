import { IncomingMessage, ServerResponse } from 'http';

import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import React from 'react';

import { AuthAPI, IAuthAPI } from '@eye8/api/auth';
import { BannerAPI, IBannerAPI } from '@eye8/api/banner';
import { CategoryAPI, ICategoryAPI } from '@eye8/api/category';
import { CharacteristicAPI, ICharacteristicAPI } from '@eye8/api/characteristic';
import { CharacteristicValueAPI, ICharacteristicValueAPI } from '@eye8/api/characteristic-value';
import { FeatureTypeAPI, IFeatureTypeAPI } from '@eye8/api/feature-type';
import { FeatureValueAPI, IFeatureValueAPI } from '@eye8/api/feature-value';
import { IOrderAPI, OrderAPI } from '@eye8/api/order';
import { IProductAPI, ProductAPI } from '@eye8/api/product';
import { IProductTypeAPI, ProductTypeAPI } from '@eye8/api/product-type';
import { IPromoCodeAPI, PromoCodeAPI } from '@eye8/api/promo-code';
import { IRateAPI, RateAPI } from '@eye8/api/rate';
import { HeadersManager } from '@eye8/manager/headers';
import { AuthService, IAuthService } from '@eye8/service/auth';
import { BannerService, IBannerService } from '@eye8/service/banner';
import { CategoryService, ICategoryService } from '@eye8/service/category';
import { CharacteristicService, ICharacteristicService } from '@eye8/service/characteristic';
import { CharacteristicValueService, ICharacteristicValueService } from '@eye8/service/characteristic-value';
import { FeatureTypeService, IFeatureTypeService } from '@eye8/service/feature-type';
import { FeatureValueService, IFeatureValueService } from '@eye8/service/feature-value';
import { IIntlService, IntlService } from '@eye8/service/intl';
import { IOrderService, OrderService } from '@eye8/service/order';
import { IProductService, ProductService } from '@eye8/service/product';
import { IProductTypeService, ProductTypeService } from '@eye8/service/product-type';
import { IPromoCodeService, PromoCodeService } from '@eye8/service/promo-code';
import { IRateService, RateService } from '@eye8/service/rate';
import { toast, ToastId } from '@eye8/shared/components/toaster';
import { safeWindow, WatchingValue } from '@eye8/shared/utils';
import { AuthStorage, IAuthStorage } from '@eye8/storage/auth';
import { CartStorage, ICartStorage } from '@eye8/storage/cart';
import { CookieStorage } from '@eye8/storage/cookie';
import { InMemoryStorage } from '@eye8/storage/in-memory';
import { IIntlStorage, IntlStorage } from '@eye8/storage/intl';
import { ServerCookieStorage } from '@eye8/storage/server-cookie';
import { IStateCacheStorage, StateCacheStorage } from '@eye8/storage/state-cache';
import { IThemeStorage, ThemeStorage } from '@eye8/storage/theme';
import { IVersionStorage, VersionStorage } from '@eye8/storage/version';

export interface IAPIsContainer {
  auth: IAuthAPI;
  category: ICategoryAPI;
  productType: IProductTypeAPI;
  product: IProductAPI;
  characteristic: ICharacteristicAPI;
  characteristicValue: ICharacteristicValueAPI;
  featureType: IFeatureTypeAPI;
  featureValue: IFeatureValueAPI;
  banner: IBannerAPI;
  order: IOrderAPI;
  promoCode: IPromoCodeAPI;
  rate: IRateAPI;
}

export interface IServicesContainer {
  auth: IAuthService;
  category: ICategoryService;
  productType: IProductTypeService;
  product: IProductService;
  characteristic: ICharacteristicService;
  characteristicValue: ICharacteristicValueService;
  featureType: IFeatureTypeService;
  featureValue: IFeatureValueService;
  intl: IIntlService;
  banner: IBannerService;
  order: IOrderService;
  promoCode: IPromoCodeService;
  rate: IRateService;
}

export interface IStoragesContainer {
  auth: IAuthStorage;
  intl: IIntlStorage;
  stateCache: IStateCacheStorage;
  cart: ICartStorage;
  version: IVersionStorage;
  theme: IThemeStorage;
}

export interface IDependenciesContainer {
  APIs: IAPIsContainer;
  services: IServicesContainer;
  storages: IStoragesContainer;
}

enum Status {
  Idle,
  Busy,
}

const tokensRefreshStatusWV = new WatchingValue<Status>(Status.Idle);
const makeResponseErrorInterceptor = (
  authService: IAuthService,
  APIClient: AxiosInstance,
  headersManager: HeadersManager,
) => async (error: { response?: AxiosResponse; config: AxiosRequestConfig }) => {
  if (error.response && error.response.status === 429) {
    toast({ id: ToastId.TooManyRequests, children: '429: Too many requests error.', type: 'error' });
  }

  if (error.response && error.response.status === 401) {
    if (tokensRefreshStatusWV.get() === Status.Idle) {
      try {
        tokensRefreshStatusWV.set(Status.Busy);
        await authService.refreshTokens();
      } catch (e) {
        authService.logOut();
      } finally {
        tokensRefreshStatusWV.set(Status.Idle);
      }
    } else if (tokensRefreshStatusWV.get() === Status.Busy) {
      await tokensRefreshStatusWV.blockUntil((status) => status === Status.Idle);
    }

    error.config.headers = headersManager.getHeaders();

    return APIClient.request(error.config);
  }

  throw error;
};

class DependenciesContainer implements IDependenciesContainer {
  public APIs: IAPIsContainer;
  public services: IServicesContainer;
  public storages: IStoragesContainer;
  constructor(APIs: IAPIsContainer, storages: IStoragesContainer, services: IServicesContainer) {
    this.APIs = APIs;
    this.storages = storages;
    this.services = services;
  }
}

export interface IDependenciesFactoryArgs {
  req?: IncomingMessage;
  res?: ServerResponse;
}

export const dependenciesFactory = ({ req, res }: IDependenciesFactoryArgs = {}): IDependenciesContainer => {
  const localStorage = safeWindow((w) => w.localStorage, new InMemoryStorage());
  const cookieStorage = req && res ? new ServerCookieStorage(req, res) : new CookieStorage();
  const stateCacheStorage_ = new StateCacheStorage(localStorage);
  const storagesContainer = {
    auth: new AuthStorage(cookieStorage),
    intl: new IntlStorage(cookieStorage),
    stateCache: stateCacheStorage_,
    cart: new CartStorage(stateCacheStorage_),
    version: new VersionStorage(localStorage),
    theme: new ThemeStorage(cookieStorage),
  };

  // Set locale detected on server if the intl storage is empty
  const reqLocale = req ? (req as IncomingMessage & { locale?: string }).locale : undefined;
  if (reqLocale && !storagesContainer.intl.getLocale()) {
    storagesContainer.intl.setLocale(reqLocale);
  }

  const headersManager = new HeadersManager(storagesContainer.auth, storagesContainer.intl);
  const APIClient = axios.create({ baseURL: safeWindow(process.env.CLIENT_API_URL, process.env.SERVER_API_URL) });

  const APIsContainer = {
    auth: new AuthAPI(APIClient, headersManager),
    category: new CategoryAPI(APIClient, headersManager),
    characteristic: new CharacteristicAPI(APIClient, headersManager),
    characteristicValue: new CharacteristicValueAPI(APIClient, headersManager),
    featureType: new FeatureTypeAPI(APIClient, headersManager),
    featureValue: new FeatureValueAPI(APIClient, headersManager),
    productType: new ProductTypeAPI(APIClient, headersManager),
    product: new ProductAPI(APIClient, headersManager),
    banner: new BannerAPI(APIClient, headersManager),
    order: new OrderAPI(APIClient, headersManager),
    promoCode: new PromoCodeAPI(APIClient, headersManager),
    rate: new RateAPI(APIClient, headersManager),
  };

  const servicesContainer = {
    auth: new AuthService(APIsContainer.auth, storagesContainer.auth, storagesContainer.stateCache),
    category: new CategoryService(APIsContainer.category),
    characteristic: new CharacteristicService(APIsContainer.characteristic),
    characteristicValue: new CharacteristicValueService(APIsContainer.characteristicValue),
    featureType: new FeatureTypeService(APIsContainer.featureType),
    featureValue: new FeatureValueService(APIsContainer.featureValue),
    intl: new IntlService(storagesContainer.intl),
    productType: new ProductTypeService(APIsContainer.productType),
    product: new ProductService(APIsContainer.product),
    banner: new BannerService(APIsContainer.banner),
    order: new OrderService(APIsContainer.order),
    promoCode: new PromoCodeService(APIsContainer.promoCode),
    rate: new RateService(APIsContainer.rate, storagesContainer.stateCache),
  };

  APIClient.interceptors.response.use(
    undefined,
    makeResponseErrorInterceptor(servicesContainer.auth, APIClient, headersManager),
  );

  return new DependenciesContainer(APIsContainer, storagesContainer, servicesContainer);
};

export interface IContextValue {
  dependencies: IDependenciesContainer;
}

const Context = React.createContext<IContextValue | null>(null);

export const DIProvider = Context.Provider;

export const useDependencies = () => React.useContext(Context) as IContextValue;
