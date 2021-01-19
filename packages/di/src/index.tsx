import React from 'react';

import AuthAPI from '@eye8/api/auth';
import BannerAPI from '@eye8/api/banner';
import CategoryAPI from '@eye8/api/category';
import CharacteristicAPI from '@eye8/api/characteristic';
import CharacteristicValueAPI from '@eye8/api/characteristic-value';
import APIClient from '@eye8/api/client';
import FeatureTypeAPI from '@eye8/api/feature-type';
import FeatureValueAPI from '@eye8/api/feature-value';
import OrderAPI from '@eye8/api/order';
import ProductAPI from '@eye8/api/product';
import ProductTypeAPI from '@eye8/api/product-type';
import PromoCodeAPI from '@eye8/api/promo-code';
import RateAPI from '@eye8/api/rate';
import HeadersManager from '@eye8/manager/headers';
import AuthService from '@eye8/service/auth';
import BannerService from '@eye8/service/banner';
import CategoryService from '@eye8/service/category';
import CharacteristicService from '@eye8/service/characteristic';
import CharacteristicValueService from '@eye8/service/characteristic-value';
import FeatureTypeService from '@eye8/service/feature-type';
import FeatureValueService from '@eye8/service/feature-value';
import IntlService from '@eye8/service/intl';
import OrderService from '@eye8/service/order';
import ProductService from '@eye8/service/product';
import ProductTypeService from '@eye8/service/product-type';
import PromoCodeService from '@eye8/service/promo-code';
import RateService from '@eye8/service/rate';
import { safeWindow } from '@eye8/shared/utils';
import AuthStorage from '@eye8/storage/auth';
import CartStorage from '@eye8/storage/cart';
import CookieStorage from '@eye8/storage/cookie';
import InMemoryStorage from '@eye8/storage/in-memory';
import IntlStorage from '@eye8/storage/intl';
import StateCacheStorage from '@eye8/storage/state-cache';
import ThemeStorage from '@eye8/storage/theme';
import VersionStorage from '@eye8/storage/version';

export interface ApiContainer {
  auth: AuthAPI;
  category: CategoryAPI;
  productType: ProductTypeAPI;
  product: ProductAPI;
  characteristic: CharacteristicAPI;
  characteristicValue: CharacteristicValueAPI;
  featureType: FeatureTypeAPI;
  featureValue: FeatureValueAPI;
  banner: BannerAPI;
  order: OrderAPI;
  promoCode: PromoCodeAPI;
  rate: RateAPI;
}

export interface ServicesContainer {
  auth: AuthService;
  category: CategoryService;
  productType: ProductTypeService;
  product: ProductService;
  characteristic: CharacteristicService;
  characteristicValue: CharacteristicValueService;
  featureType: FeatureTypeService;
  featureValue: FeatureValueService;
  intl: IntlService;
  banner: BannerService;
  order: OrderService;
  promoCode: PromoCodeService;
  rate: RateService;
}

export interface StorageContainer {
  auth: AuthStorage;
  intl: IntlStorage;
  stateCache: StateCacheStorage;
  cart: CartStorage;
  version: VersionStorage;
  theme: ThemeStorage;
}

export class DI {
  public __APIClient: APIClient;
  public api: ApiContainer;
  public service: ServicesContainer;
  public storage: StorageContainer;
  constructor(__APIClient: APIClient, api: ApiContainer, storage: StorageContainer, service: ServicesContainer) {
    this.__APIClient = __APIClient;
    this.api = api;
    this.storage = storage;
    this.service = service;
  }
}

export class DIFactory {
  private makeStorageContainer = () => {
    const localStorage = safeWindow((w) => w.localStorage, new InMemoryStorage());
    const cookieStorage = new CookieStorage();
    const stateCacheStorage_ = new StateCacheStorage(localStorage);
    return {
      auth: new AuthStorage(cookieStorage),
      intl: new IntlStorage(cookieStorage),
      stateCache: stateCacheStorage_,
      cart: new CartStorage(stateCacheStorage_),
      version: new VersionStorage(localStorage),
      theme: new ThemeStorage(cookieStorage),
    };
  };

  private makeApiContainer = (apiClient: APIClient, headersManager: HeadersManager) => {
    return {
      auth: new AuthAPI(apiClient, headersManager),
      category: new CategoryAPI(apiClient, headersManager),
      characteristic: new CharacteristicAPI(apiClient, headersManager),
      characteristicValue: new CharacteristicValueAPI(apiClient, headersManager),
      featureType: new FeatureTypeAPI(apiClient, headersManager),
      featureValue: new FeatureValueAPI(apiClient, headersManager),
      productType: new ProductTypeAPI(apiClient, headersManager),
      product: new ProductAPI(apiClient, headersManager),
      banner: new BannerAPI(apiClient, headersManager),
      order: new OrderAPI(apiClient, headersManager),
      promoCode: new PromoCodeAPI(apiClient, headersManager),
      rate: new RateAPI(apiClient, headersManager),
    };
  };

  private makeServiceContainer = (api: ApiContainer, storage: StorageContainer) => {
    return {
      auth: new AuthService(api.auth, storage.auth, storage.stateCache),
      category: new CategoryService(api.category),
      characteristic: new CharacteristicService(api.characteristic),
      characteristicValue: new CharacteristicValueService(api.characteristicValue),
      featureType: new FeatureTypeService(api.featureType),
      featureValue: new FeatureValueService(api.featureValue),
      intl: new IntlService(storage.intl),
      productType: new ProductTypeService(api.productType),
      product: new ProductService(api.product),
      banner: new BannerService(api.banner),
      order: new OrderService(api.order),
      promoCode: new PromoCodeService(api.promoCode),
      rate: new RateService(api.rate, storage.stateCache),
    };
  };

  make = () => {
    const storage = this.makeStorageContainer();

    const headersManager = new HeadersManager(storage.auth, storage.intl);
    const apiClient = new APIClient({ baseURL: safeWindow(process.env.CLIENT_API_URL, process.env.SERVER_API_URL) });
    const api = this.makeApiContainer(apiClient, headersManager);

    const service = this.makeServiceContainer(api, storage);

    return new DI(apiClient, api, storage, service);
  };
}

export interface ContextValue {
  di: DI;
}

const Context = React.createContext<ContextValue | null>(null);

export const DIProvider = Context.Provider;

export const useDI = () => React.useContext(Context) as ContextValue;
