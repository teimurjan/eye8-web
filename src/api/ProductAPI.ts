import { Client } from 'ttypes/http';

import { IHeadersManager } from 'src/manager/HeadersManager';
import { buildSearchString } from 'src/utils/queryString';

// LIST
export interface IProductListResponseMeta {
  count: number;
  pages_count: number;
  page: number;
  limit: number;
}

export interface IProductListResponseItem {
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

export interface IProductListResponseData {
  data: IProductListResponseItem[];
  meta: IProductListResponseMeta;
}

// DETAIL
export interface IProductResponseData {
  data: IProductListResponseItem;
}

// FOR PRODUCT TYPE
export interface IProductForProductTypeResponseData {
  data: IProductListResponseItem[];
}

// PAYLOADS
export interface IProductCreatePayload {
  discount: number;
  price: number;
  quantity: number;
  product_type_id: number;
  images?: Array<File | string>;
}

export type IProductEditPayload = IProductCreatePayload;

export interface IGetAllOptions {
  page: number;
  available?: boolean;
}

export interface IGetForProductTypeOptions {
  available?: boolean;
}

export interface IProductAPI {
  getAll(options: IGetAllOptions): Promise<IProductListResponseData>;
  getSome(ids: number[]): Promise<IProductListResponseData>;
  getForCart(ids: number[]): Promise<IProductListResponseData>;
  delete(id: number): Promise<{}>;
  create(payload: IProductCreatePayload): Promise<IProductResponseData>;
  edit(id: number, payload: IProductEditPayload): Promise<IProductResponseData>;
  status(id: number): Promise<{}>;
  getOne(id: number): Promise<IProductResponseData>;
  getForProductType(
    productTypeID: number,
    options: IGetForProductTypeOptions,
  ): Promise<IProductForProductTypeResponseData>;
}

export const errors = {
  ProductNotFound: class extends Error {
    constructor() {
      super('Product type not found');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class ProductAPI implements IProductAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: IProductAPI['getAll'] = async ({ page, available = false }) => {
    try {
      const response = await this.client.get<IProductListResponseData>(
        `/api/products${buildSearchString({
          page,
          available: available ? 1 : 0,
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

  public getSome: IProductAPI['getSome'] = async (ids) => {
    try {
      const response = await this.client.get<IProductListResponseData>(`/api/products${buildSearchString({ ids })}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getForCart: IProductAPI['getForCart'] = async (ids) => {
    try {
      const response = await this.client.get<IProductListResponseData>(`/api/products${buildSearchString({ ids })}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public delete: IProductAPI['delete'] = async (id) => {
    try {
      const response = await this.client.delete<{}>(`/api/products/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.ProductNotFound();
      }
      throw e;
    }
  };

  public create: IProductAPI['create'] = async ({ images, ...json }) => {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      if (images) {
        images.forEach((image) => formData.append('images', image));
      }
      const response = await this.client.post<IProductResponseData>(`/api/products`, formData, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: IProductAPI['edit'] = async (id: number, { images, ...json }) => {
    try {
      const formData = new FormData();
      formData.append('json', JSON.stringify(json));
      if (images) {
        images.forEach((image) => formData.append('images', image));
      }
      const response = await this.client.put<IProductResponseData>(`/api/products/${id}`, formData, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.ProductNotFound();
      }
      throw e;
    }
  };

  public status: IProductAPI['status'] = async (id) => {
    try {
      const response = await this.client.head<{}>(`/api/products/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.ProductNotFound();
      }
      throw e;
    }
  };

  public getOne: IProductAPI['getOne'] = async (id) => {
    try {
      const response = await this.client.get<IProductResponseData>(`/api/products/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.ProductNotFound();
      }
      throw e;
    }
  };

  public getForProductType: IProductAPI['getForProductType'] = async (productTypeID, { available = false }) => {
    const response = await this.client.get<IProductForProductTypeResponseData>(
      `/api/product_types/${productTypeID}/products${buildSearchString({ available: available ? 1 : 0 })}`,
      { headers: this.headersManager.getHeaders() },
    );
    return response.data;
  };
}
