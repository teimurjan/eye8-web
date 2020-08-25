import { IncomingMessage, ServerResponse } from 'http';

import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';

import * as authAPI from 'src/api/AuthAPI';
import * as bannerAPI from 'src/api/BannerAPI';
import * as categoryAPI from 'src/api/CategoryAPI';
import * as featureTypeAPI from 'src/api/FeatureTypeAPI';
import * as featureValueAPI from 'src/api/FeatureValueAPI';
import * as intlAPI from 'src/api/IntlAPI';
import * as orderAPI from 'src/api/OrderAPI';
import * as productAPI from 'src/api/ProductAPI';
import * as productTypeAPI from 'src/api/ProductTypeAPI';
import * as promoCodeAPI from 'src/api/PromoCodeAPI';
import * as rateAPI from 'src/api/RateAPI';
import * as searchAPI from 'src/api/SearchAPI';
import { ToastId } from 'src/components/Toast/ids';
import { toast } from 'src/components/Toast/ToastContainer';
import { HeadersManager } from 'src/manager/HeadersManager';
import * as authService from 'src/services/AuthService';
import * as bannerService from 'src/services/BannerService';
import * as categoryService from 'src/services/CategoryService';
import * as featureTypeService from 'src/services/FeatureTypeService';
import * as featureValueService from 'src/services/FeatureValueService';
import * as intlService from 'src/services/IntlService';
import * as orderService from 'src/services/OrderService';
import * as productService from 'src/services/ProductService';
import * as productTypeService from 'src/services/ProductTypeService';
import * as promoCodeService from 'src/services/PromoCodeService';
import * as rateService from 'src/services/RateService';
import * as searchService from 'src/services/SearchService';
import * as authStorage from 'src/storage/AuthStorage';
import * as cartStorage from 'src/storage/CartStorage';
import { CookieStorage } from 'src/storage/cookie/CookieStorage';
import { ServerCookieStorage } from 'src/storage/cookie/ServerCookieStorage';
import { InMemoryStorage } from 'src/storage/InMemoryStorage';
import * as intlStorage from 'src/storage/IntlStorage';
import * as stateCacheStorage from 'src/storage/StateCacheStorage';
import * as versionStorage from 'src/storage/VersionStorage';
import { safeWindow } from 'src/utils/dom';
import { WatchingValue } from 'src/utils/watching-value';

export interface IAPIsContainer {
  auth: authAPI.IAuthAPI;
  category: categoryAPI.ICategoryAPI;
  productType: productTypeAPI.IProductTypeAPI;
  product: productAPI.IProductAPI;
  featureType: featureTypeAPI.IFeatureTypeAPI;
  featureValue: featureValueAPI.IFeatureValueAPI;
  intl: intlAPI.IIntlAPI;
  search: searchAPI.ISearchAPI;
  banner: bannerAPI.IBannerAPI;
  order: orderAPI.IOrderAPI;
  promoCode: promoCodeAPI.IPromoCodeAPI;
  rate: rateAPI.IRateAPI;
}

export interface IServicesContainer {
  auth: authService.IAuthService;
  category: categoryService.ICategoryService;
  productType: productTypeService.IProductTypeService;
  product: productService.IProductService;
  featureType: featureTypeService.IFeatureTypeService;
  featureValue: featureValueService.IFeatureValueService;
  intl: intlService.IIntlService;
  search: searchService.ISearchService;
  banner: bannerService.IBannerService;
  order: orderService.IOrderService;
  promoCode: promoCodeService.IPromoCodeService;
  rate: rateService.IRateService;
}

export interface IStoragesContainer {
  auth: authStorage.IAuthStorage;
  intl: intlStorage.IIntlStorage;
  stateCache: stateCacheStorage.IStateCacheStorage;
  cart: cartStorage.ICartStorage;
  version: versionStorage.IVersionStorage;
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
  authService: authService.IAuthService,
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
      await tokensRefreshStatusWV.watchPromise((status) => status === Status.Idle);
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
  const stateCacheStorage_ = new stateCacheStorage.StateCacheStorage(localStorage);
  const storagesContainer = {
    auth: new authStorage.AuthStorage(cookieStorage),
    intl: new intlStorage.IntlStorage(cookieStorage),
    stateCache: stateCacheStorage_,
    cart: new cartStorage.CartStorage(stateCacheStorage_),
    version: new versionStorage.VersionStorage(localStorage),
  };

  // Set locale detected on server if the intl storage is empty
  const reqLocale = req ? (req as IncomingMessage & { locale?: string }).locale : undefined;
  if (reqLocale && !storagesContainer.intl.getLocale()) {
    storagesContainer.intl.setLocale(reqLocale);
  }

  const headersManager = new HeadersManager(storagesContainer.auth, storagesContainer.intl);
  const APIClient = axios.create({ baseURL: safeWindow(process.env.CLIENT_API_URL, process.env.SERVER_API_URL) });

  const APIsContainer = {
    auth: new authAPI.AuthAPI(APIClient, headersManager),
    category: new categoryAPI.CategoryAPI(APIClient, headersManager),
    featureType: new featureTypeAPI.FeatureTypeAPI(APIClient, headersManager),
    featureValue: new featureValueAPI.FeatureValueAPI(APIClient, headersManager),
    intl: new intlAPI.IntlAPI(APIClient, headersManager),
    productType: new productTypeAPI.ProductTypeAPI(APIClient, headersManager),
    product: new productAPI.ProductAPI(APIClient, headersManager),
    search: new searchAPI.SearchAPI(APIClient, headersManager),
    banner: new bannerAPI.BannerAPI(APIClient, headersManager),
    order: new orderAPI.OrderAPI(APIClient, headersManager),
    promoCode: new promoCodeAPI.PromoCodeAPI(APIClient, headersManager),
    rate: new rateAPI.RateAPI(APIClient, headersManager),
  };

  const servicesContainer = {
    auth: new authService.AuthService(APIsContainer.auth, storagesContainer.auth, storagesContainer.stateCache),
    category: new categoryService.CategoryService(APIsContainer.category),
    featureType: new featureTypeService.FeatureTypeService(APIsContainer.featureType),
    featureValue: new featureValueService.FeatureValueService(APIsContainer.featureValue),
    intl: new intlService.IntlService(APIsContainer.intl, storagesContainer.intl),
    productType: new productTypeService.ProductTypeService(APIsContainer.productType),
    product: new productService.ProductService(APIsContainer.product),
    search: new searchService.SearchService(APIsContainer.search),
    banner: new bannerService.BannerService(APIsContainer.banner),
    order: new orderService.OrderService(APIsContainer.order),
    promoCode: new promoCodeService.PromoCodeService(APIsContainer.promoCode),
    rate: new rateService.RateService(APIsContainer.rate, storagesContainer.stateCache),
  };

  APIClient.interceptors.response.use(
    undefined,
    makeResponseErrorInterceptor(servicesContainer.auth, APIClient, headersManager),
  );

  return new DependenciesContainer(APIsContainer, storagesContainer, servicesContainer);
};
