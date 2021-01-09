import { Client } from '@eye8/api/types';
import { HeadersManager } from '@eye8/manager/headers';
import { flagToSearchStringValue, buildSearchString } from '@eye8/shared/utils';

// LIST
export interface ProductListResponseMeta {
  count: number;
  pages_count: number;
  page: number;
  limit: number;
}

export interface ProductListResponseItem {
  id: number;
  discount: number;
  price: number;
  quantity: number;
  product_type: { category: number; feature_types: number[]; id: number; name: string; slug: string; image: string };
  feature_values: Array<{
    feature_type: { id: number; name: string };
    id: number;
    name: string;
  }>;
  images: string[];
  created_on: string;
  updated_on: string;
}

export interface ProductListResponseData {
  data: ProductListResponseItem[];
  meta: ProductListResponseMeta;
}

// DETAIL
export interface ProductResponseData {
  data: ProductListResponseItem;
}

// FOR PRODUCT TYPE
export interface ProductForProductTypeResponseData {
  data: ProductListResponseItem[];
}

// PAYLOADS
export interface ProductCreatePayload {
  discount: number;
  price: number;
  quantity: number;
  product_type_id: number;
  images?: Array<File | string>;
}

export type ProductEditPayload = ProductCreatePayload;

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

export interface ProductAPI {
  getAll(options: GetAllOptions): Promise<ProductListResponseData>;
  getSome(ids: number[]): Promise<ProductListResponseData>;
  getForCart(ids: number[]): Promise<ProductListResponseData>;
  delete(id: number, options: DeleteOptions): Promise<{}>;
  create(payload: ProductCreatePayload): Promise<ProductResponseData>;
  edit(id: number, payload: ProductEditPayload): Promise<ProductResponseData>;
  status(id: number, options: GetOneOptions): Promise<{}>;
  getOne(id: number, options: GetOneOptions): Promise<ProductResponseData>;
  getForProductType(
    productTypeID: number,
    options: GetForProductTypeOptions,
  ): Promise<ProductForProductTypeResponseData>;
}

export class ProductNotFoundError extends Error {
  constructor() {
    super('Product type not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements ProductAPI {
  private client: Client;
  private headersManager: HeadersManager;

  constructor(client: Client, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: ProductAPI['getAll'] = async ({ page, available = false, deleted = false }) => {
    try {
      const response = await this.client.get<ProductListResponseData>(
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
      const response = await this.client.get<ProductListResponseData>(`/api/products${buildSearchString({ ids })}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getForCart: ProductAPI['getForCart'] = async (ids) => {
    try {
      const response = await this.client.get<ProductListResponseData>(`/api/products${buildSearchString({ ids })}`, {
        headers: this.headersManager.getHeaders(),
      });
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
        throw new ProductNotFoundError();
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
      const response = await this.client.post<ProductResponseData>(`/api/products`, formData, {
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
      const response = await this.client.put<ProductResponseData>(`/api/products/${id}`, formData, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new ProductNotFoundError();
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
        throw new ProductNotFoundError();
      }
      throw e;
    }
  };

  public getOne: ProductAPI['getOne'] = async (id, { deleted = false }) => {
    try {
      const response = await this.client.get<ProductResponseData>(
        `/api/products/${id}${buildSearchString({ deleted: flagToSearchStringValue(deleted) })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new ProductNotFoundError();
      }
      throw e;
    }
  };

  public getForProductType: ProductAPI['getForProductType'] = async (productTypeID, { available = false }) => {
    const response = await this.client.get<ProductForProductTypeResponseData>(
      `/api/product_types/${productTypeID}/products${buildSearchString({
        available: flagToSearchStringValue(available),
      })}`,
      { headers: this.headersManager.getHeaders() },
    );
    return response.data;
  };
}
