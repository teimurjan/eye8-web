import { IncomingMessage, ServerResponse } from 'http';

import axios, { AxiosInstance } from 'axios';
import React from 'react';

import AuthAPI from '@eye8/api/auth';
import BannerAPI from '@eye8/api/banner';
import CategoryAPI from '@eye8/api/category';
import CharacteristicAPI from '@eye8/api/characteristic';
import CharacteristicValueAPI from '@eye8/api/characteristic-value';
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
import ServerCookieStorage from '@eye8/storage/server-cookie';
import StateCacheStorage from '@eye8/storage/state-cache';
import ThemeStorage from '@eye8/storage/theme';
import VersionStorage from '@eye8/storage/version';

export interface APIsContainer {
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

export interface StoragesContainer {
  auth: AuthStorage;
  intl: IntlStorage;
  stateCache: StateCacheStorage;
  cart: CartStorage;
  version: VersionStorage;
  theme: ThemeStorage;
}

export interface IDependenciesContainer {
  __APIClient: AxiosInstance;
  __headersManager: HeadersManager;
  APIs: APIsContainer;
  services: ServicesContainer;
  storages: StoragesContainer;
}

class DependenciesContainer implements IDependenciesContainer {
  public __APIClient: AxiosInstance;
  public __headersManager: HeadersManager;
  public APIs: APIsContainer;
  public services: ServicesContainer;
  public storages: StoragesContainer;
  constructor(
    __APIClient: AxiosInstance,
    __headersManager: HeadersManager,
    APIs: APIsContainer,
    storages: StoragesContainer,
    services: ServicesContainer,
  ) {
    this.__APIClient = __APIClient;
    this.__headersManager = __headersManager;
    this.APIs = APIs;
    this.storages = storages;
    this.services = services;
  }
}

export interface DependenciesFactoryArgs {
  req?: IncomingMessage;
  res?: ServerResponse;
}

export const dependenciesFactory = ({ req, res }: DependenciesFactoryArgs = {}): DependenciesContainer => {
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

  return new DependenciesContainer(APIClient, headersManager, APIsContainer, storagesContainer, servicesContainer);
};

export interface ContextValue {
  dependencies: DependenciesContainer;
}

const Context = React.createContext<ContextValue | null>(null);

export const DIProvider = Context.Provider;

export const useDependencies = () => React.useContext(Context) as ContextValue;
