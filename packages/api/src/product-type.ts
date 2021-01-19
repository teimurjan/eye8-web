import { APIClient } from '@eye8/api/client';
import { HeadersManager } from '@eye8/manager/headers';
import { flagToSearchStringValue, buildSearchString } from '@eye8/shared/utils';

// LIST
export interface ProductTypeListResponseMeta {
  count: number;
  pages_count: number;
  page: number;
  limit: number;
}

export interface ProductTypeListResponseItem {
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

export interface ProductTypeListResponseData {
  data: ProductTypeListResponseItem[];
  meta: ProductTypeListResponseMeta;
}

// DETAIL
export interface ProductTypeDetailResponseItem {
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

export interface ProductTypeDetailResponseItemData {
  data: ProductTypeDetailResponseItem;
}

// LIST RAW INTL
export interface ProductTypeListRawIntlResponseItem {
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

export interface ProductTypeListRawIntlResponseData {
  data: ProductTypeListRawIntlResponseItem[];
  meta: ProductTypeListResponseMeta;
}

// DETAIL RAW INTL
export interface ProductTypeDetailRawIntlResponseItem {
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

export interface ProductTypeRawIntlResponseData {
  data: ProductTypeDetailRawIntlResponseItem;
}

// LIST RAW INTL MINIFIED
export interface ProductTypeListRawIntlMinifiedResponseItem {
  id: number;
  name: {
    [key: string]: string;
  };
  feature_types: number[];
}

export interface ProductTypeListRawIntlMinifiedResponseData {
  data: ProductTypeListRawIntlMinifiedResponseItem[];
  meta: ProductTypeListResponseMeta;
}

export interface ProductTypeCreatePayload {
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

export type ProductTypeEditPayload = ProductTypeCreatePayload;

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

export interface GetForCategoryOptions {
  page: number;
  sortingType?: ProductTypeSortingType;
  characteristicValuesIds?: number[];
  available?: boolean;
}

export interface GetAllOptions {
  page: number;
  deleted?: boolean;
  available?: boolean;
}

export interface GetOneOptions {
  deleted?: boolean;
}

export interface DeleteOptions {
  forever?: boolean;
}

export interface GetAllRawIntlMinifiedOptions {
  page: number;
  sortingType?: ProductTypeSortingType;
  available?: boolean;
}

interface PrivateSearchOptions {
  page?: number;
  available?: boolean;
  deleted?: boolean;
  rawIntl?: boolean;
}

export type SearchOptions = Omit<PrivateSearchOptions, 'rawIntl'>;

export interface ProductTypeAPI {
  getForCategory(categorySlug: string, options: GetForCategoryOptions): Promise<ProductTypeListResponseData>;
  search(query: string, options: SearchOptions): Promise<ProductTypeListResponseData>;
  searchRawIntl(query: string, options: SearchOptions): Promise<ProductTypeListRawIntlResponseData>;
  getAll(options: GetAllOptions): Promise<ProductTypeListResponseData>;
  getNewest(): Promise<ProductTypeListResponseData>;
  getByID(id: number, options: GetOneOptions): Promise<ProductTypeDetailResponseItemData>;
  getBySlug(slug: string): Promise<ProductTypeDetailResponseItemData>;
  getAllRawIntlMinified(options: GetAllRawIntlMinifiedOptions): Promise<ProductTypeListRawIntlMinifiedResponseData>;
  getAllRawIntl(options: GetAllOptions): Promise<ProductTypeListRawIntlResponseData>;
  delete(id: number, options: DeleteOptions): Promise<{}>;
  create(payload: ProductTypeCreatePayload): Promise<ProductTypeRawIntlResponseData>;
  edit(id: number, payload: ProductTypeEditPayload): Promise<ProductTypeRawIntlResponseData>;
  status(id: number, options: GetOneOptions): Promise<{}>;
  getOneRawIntl(id: number, options: GetOneOptions): Promise<ProductTypeRawIntlResponseData>;
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

export default class implements ProductTypeAPI {
  private client: APIClient;
  private headersManager: HeadersManager;

  constructor(client: APIClient, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getForCategory: ProductTypeAPI['getForCategory'] = async (
    categorySlug: string,
    { page, sortingType = ProductTypeSortingType.RECENT, characteristicValuesIds = [], available = true },
  ) => {
    try {
      const response = await this.client.get<ProductTypeListResponseData>(
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

  public search: ProductTypeAPI['search'] = async (query, options) =>
    this.search_<ProductTypeListResponseData>(query, options);

  public searchRawIntl: ProductTypeAPI['searchRawIntl'] = async (query, options) =>
    this.search_<ProductTypeListRawIntlResponseData>(query, { ...options, rawIntl: true });

  private search_ = async <T extends ProductTypeListRawIntlResponseData | ProductTypeListResponseData>(
    query: string,
    { page, rawIntl = false, available = true, deleted = false }: PrivateSearchOptions,
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

  public getAll: ProductTypeAPI['getAll'] = async ({ page, deleted, available = false }) => {
    try {
      const response = await this.client.get<ProductTypeListResponseData>(
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

  public getNewest: ProductTypeAPI['getNewest'] = async () => {
    try {
      const response = await this.client.get<ProductTypeListResponseData>(
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

  public getByID: ProductTypeAPI['getByID'] = async (id: number, { deleted }) => {
    try {
      const response = await this.client.get<ProductTypeDetailResponseItemData>(
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

  public getBySlug: ProductTypeAPI['getBySlug'] = async (slug) => {
    try {
      const response = await this.client.get<ProductTypeDetailResponseItemData>(`/api/product_types/${slug}`, {
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

  public getAllRawIntlMinified: ProductTypeAPI['getAllRawIntlMinified'] = async ({ page, sortingType, available }) => {
    try {
      const response = await this.client.get<ProductTypeListRawIntlMinifiedResponseData>(
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

  public getAllRawIntl: ProductTypeAPI['getAllRawIntl'] = async ({ page, deleted, available = false }) => {
    try {
      const response = await this.client.get<ProductTypeListRawIntlResponseData>(
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

  public delete: ProductTypeAPI['delete'] = async (id: number, { forever }) => {
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

  public create: ProductTypeAPI['create'] = async ({ image, ...json }) => {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      formData.append('image', image);
      const response = await this.client.post<ProductTypeRawIntlResponseData>(`/api/product_types`, formData, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: ProductTypeAPI['edit'] = async (id: number, { image, ...json }) => {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      formData.append('image', image);
      const response = await this.client.put<ProductTypeRawIntlResponseData>(
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

  public status: ProductTypeAPI['status'] = async (id: number, { deleted }) => {
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

  public getOneRawIntl: ProductTypeAPI['getOneRawIntl'] = async (id: number, { deleted }) => {
    try {
      const response = await this.client.get<ProductTypeRawIntlResponseData>(
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
