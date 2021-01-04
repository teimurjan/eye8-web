import { Client } from '@eye8/api/types';
import { IHeadersManager } from '@eye8/manager/headers';
import { flagToSearchStringValue, buildSearchString } from '@eye8/shared/utils';

// LIST
export interface IProductTypeListResponseMeta {
  count: number;
  pages_count: number;
  page: number;
  limit: number;
}

export interface IProductTypeListResponseItem {
  id: number;
  name: string;
  description: string;
  short_description: string;
  instagram_links: Array<{ id: number; link: string }>;
  image: string;
  categories: number[];
  slug: string;
  feature_types: number[];
  products?: Array<{
    discount: number;
    feature_values: number[];
    id: number;
    price: number;
    quantity: number;
  }>;
  created_on: string;
  updated_on: string;
  is_deleted: boolean | null;
}

export interface IProductTypeListResponseData {
  data: IProductTypeListResponseItem[];
  meta: IProductTypeListResponseMeta;
}

// DETAIL
export interface IProductTypeDetailResponseItem {
  id: number;
  name: string;
  description: string;
  short_description: string;
  instagram_links: Array<{ id: number; link: string }>;
  image: string;
  categories: Array<{ id: number; name: string; slug: string }>;
  slug: string;
  feature_types: number[];
  products?: Array<{
    discount: number;
    feature_values: number[];
    id: number;
    price: number;
    quantity: number;
  }>;
  created_on: string;
  updated_on: string;
  is_deleted: boolean | null;
}

export interface IProductTypeDetailResponseItemData {
  data: IProductTypeDetailResponseItem;
}

// LIST RAW INTL
export interface IProductTypeListRawIntlResponseItem {
  id: number;
  name: { [key: string]: string };
  description: { [key: string]: string };
  short_description: { [key: string]: string };
  instagram_links: Array<{ id: number; link: string }>;
  image: string;
  categories: Array<{ id: number }>;
  feature_types: number[];
  slug: string;
  created_on: string;
  updated_on: string;
  is_deleted: boolean | null;
}

export interface IProductTypeListRawIntlResponseData {
  data: IProductTypeListRawIntlResponseItem[];
  meta: IProductTypeListResponseMeta;
}

// DETAIL RAW INTL
export interface IProductTypeDetailRawIntlResponseItem {
  id: number;
  name: { [key: string]: string };
  description: { [key: string]: string };
  short_description: { [key: string]: string };
  instagram_links: Array<{ id: number; link: string }>;
  image: string;
  categories: Array<{ id: number }>;
  feature_types: number[];
  characteristic_values: number[];
  slug: string;
  created_on: string;
  updated_on: string;
  is_deleted: boolean | null;
}

export interface IProductTypeRawIntlResponseData {
  data: IProductTypeDetailRawIntlResponseItem;
}

// LIST RAW INTL MINIFIED
export interface IProductTypeListRawIntlMinifiedResponseItem {
  id: number;
  name: {
    [key: string]: string;
  };
  feature_types: number[];
}

export interface IProductTypeListRawIntlMinifiedResponseData {
  data: IProductTypeListRawIntlMinifiedResponseItem[];
  meta: IProductTypeListResponseMeta;
}

export interface IProductTypeCreatePayload {
  names: {
    [key: string]: string;
  };
  descriptions: {
    [key: string]: string;
  };
  short_descriptions: {
    [key: string]: string;
  };
  image: string;
  categories: number[];
  feature_types: number[];
  instagram_links: string[];
}

export type IProductTypeEditPayload = IProductTypeCreatePayload;

export enum ProductTypeSortingType {
  PRICE_ASCENDING,
  PRICE_DESCENDING,
  RECENT,
}

export enum ProductTypeSortingQueryValue {
  PRICE_ASCENDING = 'price_asc',
  PRICE_DESCENDING = 'price_desc',
  RECENT = 'recent',
}

export const queryValueOfSortingType = {
  [ProductTypeSortingType.RECENT]: ProductTypeSortingQueryValue.RECENT,
  [ProductTypeSortingType.PRICE_ASCENDING]: ProductTypeSortingQueryValue.PRICE_ASCENDING,
  [ProductTypeSortingType.PRICE_DESCENDING]: ProductTypeSortingQueryValue.PRICE_DESCENDING,
};

export const sortingTypeOfQueryValue = {
  [ProductTypeSortingQueryValue.RECENT]: ProductTypeSortingType.RECENT,
  [ProductTypeSortingQueryValue.PRICE_ASCENDING]: ProductTypeSortingType.PRICE_ASCENDING,
  [ProductTypeSortingQueryValue.PRICE_DESCENDING]: ProductTypeSortingType.PRICE_DESCENDING,
};

export interface IGetForCategoryOptions {
  page: number;
  sortingType?: ProductTypeSortingType;
  characteristicValuesIds?: number[];
  available?: boolean;
}

export interface IGetAllOptions {
  page: number;
  deleted?: boolean;
  available?: boolean;
}

export interface IGetOneOptions {
  deleted?: boolean;
}

export interface IDeleteOptions {
  forever?: boolean;
}

export interface IGetAllRawIntlMinifiedOptions {
  page: number;
  sortingType?: ProductTypeSortingType;
  available?: boolean;
}

interface IPrivateSearchOptions {
  page?: number;
  available?: boolean;
  deleted?: boolean;
  rawIntl?: boolean;
}

export type ISearchOptions = Omit<IPrivateSearchOptions, 'rawIntl'>;

export interface IProductTypeAPI {
  getForCategory(categorySlug: string, options: IGetForCategoryOptions): Promise<IProductTypeListResponseData>;
  search(query: string, options: ISearchOptions): Promise<IProductTypeListResponseData>;
  searchRawIntl(query: string, options: ISearchOptions): Promise<IProductTypeListRawIntlResponseData>;
  getAll(options: IGetAllOptions): Promise<IProductTypeListResponseData>;
  getNewest(): Promise<IProductTypeListResponseData>;
  getByID(id: number, options: IGetOneOptions): Promise<IProductTypeDetailResponseItemData>;
  getBySlug(slug: string): Promise<IProductTypeDetailResponseItemData>;
  getAllRawIntlMinified(options: IGetAllRawIntlMinifiedOptions): Promise<IProductTypeListRawIntlMinifiedResponseData>;
  getAllRawIntl(options: IGetAllOptions): Promise<IProductTypeListRawIntlResponseData>;
  delete(id: number, options: IDeleteOptions): Promise<{}>;
  create(payload: IProductTypeCreatePayload): Promise<IProductTypeRawIntlResponseData>;
  edit(id: number, payload: IProductTypeEditPayload): Promise<IProductTypeRawIntlResponseData>;
  status(id: number, options: IGetOneOptions): Promise<{}>;
  getOneRawIntl(id: number, options: IGetOneOptions): Promise<IProductTypeRawIntlResponseData>;
}

export class ProductTypeNotFoundError extends Error {
  constructor() {
    super('Product type not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class ProductTypeWithProductsNotDeletedError extends Error {
  constructor() {
    super('Product type with products cannot be deleted');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ProductTypeAPI implements IProductTypeAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getForCategory: IProductTypeAPI['getForCategory'] = async (
    categorySlug: string,
    { page, sortingType = ProductTypeSortingType.RECENT, characteristicValuesIds = [], available = true },
  ) => {
    try {
      const response = await this.client.get<IProductTypeListResponseData>(
        `/api/categories/${categorySlug}/product_types${buildSearchString({
          page,
          sort_by: queryValueOfSortingType[sortingType],
          products: 1,
          available: flagToSearchStringValue(available),
          characteristics: characteristicValuesIds,
        })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public search: IProductTypeAPI['search'] = async (query, options) =>
    this.search_<IProductTypeListResponseData>(query, options);

  public searchRawIntl: IProductTypeAPI['searchRawIntl'] = async (query, options) =>
    this.search_<IProductTypeListRawIntlResponseData>(query, { ...options, rawIntl: true });

  private search_ = async <T extends IProductTypeListRawIntlResponseData | IProductTypeListResponseData>(
    query: string,
    { page, rawIntl = false, available = true, deleted = false }: IPrivateSearchOptions,
  ) => {
    try {
      const response = await this.client.get<T>(
        `/api/product_types/search/${query}${buildSearchString({
          page,
          available: flagToSearchStringValue(available),
          raw_intl: flagToSearchStringValue(rawIntl),
          deleted: flagToSearchStringValue(deleted),
        })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAll: IProductTypeAPI['getAll'] = async ({ page, deleted, available = false }) => {
    try {
      const response = await this.client.get<IProductTypeListResponseData>(
        `/api/product_types${buildSearchString({
          page,
          deleted: flagToSearchStringValue(deleted),
          available: flagToSearchStringValue(available),
        })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getNewest: IProductTypeAPI['getNewest'] = async () => {
    try {
      const response = await this.client.get<IProductTypeListResponseData>(
        `/api/product_types${buildSearchString({
          page: 1,
          sort_by: queryValueOfSortingType[ProductTypeSortingType.RECENT],
          limit: 8,
          products: 1,
          available: 1,
        })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getByID: IProductTypeAPI['getByID'] = async (id: number, { deleted }) => {
    try {
      const response = await this.client.get<IProductTypeDetailResponseItemData>(
        `/api/product_types/${id}${buildSearchString({ deleted: flagToSearchStringValue(deleted) })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new ProductTypeNotFoundError();
      }
      throw e;
    }
  };

  public getBySlug: IProductTypeAPI['getBySlug'] = async (slug) => {
    try {
      const response = await this.client.get<IProductTypeDetailResponseItemData>(`/api/product_types/${slug}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new ProductTypeNotFoundError();
      }
      throw e;
    }
  };

  public getAllRawIntlMinified: IProductTypeAPI['getAllRawIntlMinified'] = async ({ page, sortingType, available }) => {
    try {
      const response = await this.client.get<IProductTypeListRawIntlMinifiedResponseData>(
        `/api/product_types${buildSearchString({
          fields: ['id', 'name', 'feature_types'],
          raw_intl: 1,
          page,
          limit: typeof page !== 'undefined' ? 10 : undefined,
          sort_by: sortingType ? queryValueOfSortingType[sortingType] : undefined,
          available: flagToSearchStringValue(available),
        })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: IProductTypeAPI['getAllRawIntl'] = async ({ page, deleted, available = false }) => {
    try {
      const response = await this.client.get<IProductTypeListRawIntlResponseData>(
        `/api/product_types${buildSearchString({
          page,
          raw_intl: 1,
          limit: 10,
          deleted: flagToSearchStringValue(deleted),
          available: flagToSearchStringValue(available),
        })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public delete: IProductTypeAPI['delete'] = async (id: number, { forever }) => {
    try {
      const response = await this.client.delete<{}>(
        `/api/product_types/${id}${buildSearchString({ forever: flagToSearchStringValue(forever) })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new ProductTypeNotFoundError();
      }
      if (e.response.data.products) {
        throw new ProductTypeWithProductsNotDeletedError();
      }

      throw e;
    }
  };

  public create: IProductTypeAPI['create'] = async ({ image, ...json }) => {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      formData.append('image', image);
      const response = await this.client.post<IProductTypeRawIntlResponseData>(`/api/product_types`, formData, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: IProductTypeAPI['edit'] = async (id: number, { image, ...json }) => {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      formData.append('image', image);
      const response = await this.client.put<IProductTypeRawIntlResponseData>(
        `/api/product_types/${id}${buildSearchString({ raw_intl: 1 })}`,
        formData,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new ProductTypeNotFoundError();
      }
      throw e;
    }
  };

  public status: IProductTypeAPI['status'] = async (id: number, { deleted }) => {
    try {
      const response = await this.client.head<{}>(
        `/api/product_types/${id}${buildSearchString({ deleted: flagToSearchStringValue(deleted) })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new ProductTypeNotFoundError();
      }
      throw e;
    }
  };

  public getOneRawIntl: IProductTypeAPI['getOneRawIntl'] = async (id: number, { deleted }) => {
    try {
      const response = await this.client.get<IProductTypeRawIntlResponseData>(
        `/api/product_types/${id}${buildSearchString({ raw_intl: 1, deleted: flagToSearchStringValue(deleted) })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new ProductTypeNotFoundError();
      }
      throw e;
    }
  };
}
