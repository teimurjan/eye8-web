import { HeadersManager } from '@eye8/manager/headers';
import { flagToSearchStringValue, buildSearchString } from '@eye8/shared/utils';

import { ProductType, TinyProductType, PaginationMeta, APIClient } from './types';

export interface CreatePayload {
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

export type EditPayload = CreatePayload;

export enum SortingType {
  PRICE_ASCENDING,
  PRICE_DESCENDING,
  RECENT,
}

export enum SortingQueryValue {
  PRICE_ASCENDING = 'price_asc',
  PRICE_DESCENDING = 'price_desc',
  RECENT = 'recent',
}

export const queryValueOfSortingType = {
  [SortingType.RECENT]: SortingQueryValue.RECENT,
  [SortingType.PRICE_ASCENDING]: SortingQueryValue.PRICE_ASCENDING,
  [SortingType.PRICE_DESCENDING]: SortingQueryValue.PRICE_DESCENDING,
};

export const sortingTypeOfQueryValue = {
  [SortingQueryValue.RECENT]: SortingType.RECENT,
  [SortingQueryValue.PRICE_ASCENDING]: SortingType.PRICE_ASCENDING,
  [SortingQueryValue.PRICE_DESCENDING]: SortingType.PRICE_DESCENDING,
};

export interface GetForCategoryOptions {
  page: number;
  sortingType?: SortingType;
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
  sortingType?: SortingType;
  available?: boolean;
}

interface PrivateSearchOptions {
  page?: number;
  available?: boolean;
  deleted?: boolean;
  rawIntl?: boolean;
}

export type SearchOptions = Omit<PrivateSearchOptions, 'rawIntl'>;

interface ProductTypeAPI {
  getForCategory(
    categorySlug: string,
    options: GetForCategoryOptions,
  ): Promise<{ data: ProductType[]; meta: PaginationMeta }>;
  search(query: string, options: SearchOptions): Promise<{ data: ProductType[]; meta: PaginationMeta }>;
  searchRawIntl(query: string, options: SearchOptions): Promise<{ data: ProductType<true>[]; meta: PaginationMeta }>;
  getAll(options: GetAllOptions): Promise<{ data: ProductType[]; meta: PaginationMeta }>;
  getNewest(): Promise<{ data: ProductType[] }>;
  getByID(id: number, options: GetOneOptions): Promise<{ data: ProductType }>;
  getBySlug(slug: string): Promise<{ data: ProductType }>;
  getAllRawIntlMinified(
    options: GetAllRawIntlMinifiedOptions,
  ): Promise<{ data: TinyProductType<true>[]; meta: PaginationMeta }>;
  getAllRawIntl(options: GetAllOptions): Promise<{ data: ProductType<true>[]; meta: PaginationMeta }>;
  delete(id: number, options: DeleteOptions): Promise<{}>;
  create(payload: CreatePayload): Promise<{ data: ProductType<true> }>;
  edit(id: number, payload: EditPayload): Promise<{ data: ProductType<true> }>;
  status(id: number, options: GetOneOptions): Promise<{}>;
  getOneRawIntl(id: number, options: GetOneOptions): Promise<{ data: ProductType<true> }>;
}

export class NotFoundError extends Error {
  constructor() {
    super('Product type not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class DeletionWithProductsError extends Error {
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
    { page, sortingType = SortingType.RECENT, characteristicValuesIds = [], available = true },
  ) => {
    try {
      const response = await this.client.get<{ data: ProductType[]; meta: PaginationMeta }>(
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
    this.search_<{ data: ProductType[]; meta: PaginationMeta }>(query, options);

  public searchRawIntl: ProductTypeAPI['searchRawIntl'] = async (query, options) =>
    this.search_<{ data: ProductType<true>[]; meta: PaginationMeta }>(query, { ...options, rawIntl: true });

  private search_ = async <
    T extends { data: ProductType<true>[] } | ({ data: ProductType[] } & { meta: PaginationMeta })
  >(
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
      const response = await this.client.get<{ data: ProductType[]; meta: PaginationMeta }>(
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
      const response = await this.client.get<{ data: ProductType[] }>(
        `/api/product_types${buildSearchString({
          page: 1,
          sort_by: queryValueOfSortingType[SortingType.RECENT],
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
      const response = await this.client.get<{ data: ProductType }>(
        `/api/product_types/${id}${buildSearchString({ deleted: flagToSearchStringValue(deleted) })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new NotFoundError();
      }
      throw e;
    }
  };

  public getBySlug: ProductTypeAPI['getBySlug'] = async (slug) => {
    try {
      const response = await this.client.get<{ data: ProductType }>(`/api/product_types/${slug}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new NotFoundError();
      }
      throw e;
    }
  };

  public getAllRawIntlMinified: ProductTypeAPI['getAllRawIntlMinified'] = async ({ page, sortingType, available }) => {
    try {
      const response = await this.client.get<{ data: TinyProductType<true>[]; meta: PaginationMeta }>(
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
      const response = await this.client.get<{ data: ProductType<true>[]; meta: PaginationMeta }>(
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
        throw new NotFoundError();
      }
      if (e.response.data.products) {
        throw new DeletionWithProductsError();
      }

      throw e;
    }
  };

  public create: ProductTypeAPI['create'] = async ({ image, ...json }) => {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      formData.append('image', image);
      const response = await this.client.post<{ data: ProductType<true> }>(`/api/product_types`, formData, {
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
      const response = await this.client.put<{ data: ProductType<true> }>(
        `/api/product_types/${id}${buildSearchString({ raw_intl: 1 })}`,
        formData,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new NotFoundError();
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
        throw new NotFoundError();
      }
      throw e;
    }
  };

  public getOneRawIntl: ProductTypeAPI['getOneRawIntl'] = async (id: number, { deleted }) => {
    try {
      const response = await this.client.get<{ data: ProductType<true> }>(
        `/api/product_types/${id}${buildSearchString({ raw_intl: 1, deleted: flagToSearchStringValue(deleted) })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new NotFoundError();
      }
      throw e;
    }
  };
}
