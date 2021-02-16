import { HeadersManager } from '@eye8/manager/headers';
import { flagToSearchStringValue, buildSearchString } from '@eye8/shared/utils';

import { Product, PaginationMeta, APIClient } from './types';

export interface CreatePayload {
  discount: number;
  price: number;
  quantity: number;
  product_type_id: number;
  images?: Array<File | string>;
}

export type EditPayload = CreatePayload;

export interface GetAllOptions {
  page: number;
  available?: boolean;
  deleted?: boolean;
}

export interface GetForProductTypeOptions {
  available?: boolean;
}

export interface GetOneOptions {
  deleted?: boolean;
}

export interface DeleteOptions {
  forever?: boolean;
}

interface ProductAPI {
  getAll(options: GetAllOptions): Promise<{ data: Product[]; meta: PaginationMeta }>;
  getSome(ids: number[]): Promise<{ data: Product[]; meta: PaginationMeta }>;
  getForCart(ids: number[]): Promise<{ data: Product[]; meta: PaginationMeta }>;
  delete(id: number, options: DeleteOptions): Promise<{}>;
  create(payload: CreatePayload): Promise<{ data: Product }>;
  edit(id: number, payload: EditPayload): Promise<{ data: Product }>;
  status(id: number, options: GetOneOptions): Promise<{}>;
  getOne(id: number, options: GetOneOptions): Promise<{ data: Product }>;
  getForProductType(productTypeID: number, options: GetForProductTypeOptions): Promise<{ data: Product[] }>;
}

export class NotFoundError extends Error {
  constructor() {
    super('Product type not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements ProductAPI {
  private client: APIClient;
  private headersManager: HeadersManager;

  constructor(client: APIClient, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: ProductAPI['getAll'] = async ({ page, available = false, deleted = false }) => {
    try {
      const response = await this.client.get<{ data: Product[]; meta: PaginationMeta }>(
        `/api/products${buildSearchString({
          page,
          available: flagToSearchStringValue(available),
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

  public getSome: ProductAPI['getSome'] = async (ids) => {
    try {
      const response = await this.client.get<{ data: Product[]; meta: PaginationMeta }>(
        `/api/products${buildSearchString({ ids })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getForCart: ProductAPI['getForCart'] = async (ids) => {
    try {
      const response = await this.client.get<{ data: Product[]; meta: PaginationMeta }>(
        `/api/products${buildSearchString({ ids })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public delete: ProductAPI['delete'] = async (id, { forever = false }) => {
    try {
      const response = await this.client.delete<{}>(
        `/api/products/${id}${buildSearchString({ forever: flagToSearchStringValue(forever) })}`,
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

  public create: ProductAPI['create'] = async ({ images, ...json }) => {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      if (images) {
        images.forEach((image) => formData.append('images', image));
      }
      const response = await this.client.post<{ data: Product }>(`/api/products`, formData, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: ProductAPI['edit'] = async (id: number, { images, ...json }) => {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      if (images) {
        images.forEach((image) => formData.append('images', image));
      }
      const response = await this.client.put<{ data: Product }>(`/api/products/${id}`, formData, {
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

  public status: ProductAPI['status'] = async (id, { deleted = false }) => {
    try {
      const response = await this.client.head<{}>(
        `/api/products/${id}${buildSearchString({ deleted: flagToSearchStringValue(deleted) })}`,
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

  public getOne: ProductAPI['getOne'] = async (id, { deleted = false }) => {
    try {
      const response = await this.client.get<{ data: Product }>(
        `/api/products/${id}${buildSearchString({ deleted: flagToSearchStringValue(deleted) })}`,
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

  public getForProductType: ProductAPI['getForProductType'] = async (productTypeID, { available = false }) => {
    const response = await this.client.get<{ data: Product[] }>(
      `/api/product_types/${productTypeID}/products${buildSearchString({
        available: flagToSearchStringValue(available),
      })}`,
      { headers: this.headersManager.getHeaders() },
    );
    return response.data;
  };
}
