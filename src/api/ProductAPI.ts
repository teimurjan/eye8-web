import { Client } from 'ttypes/http';

import { IHeadersManager } from 'src/manager/HeadersManager';
import { buildQueryString } from 'src/utils/queryString';

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
  upc?: string;
  product_type: { id: number; name: string; image: string };
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
export interface IProductResponseItem {
  id: number;
  discount: number;
  price: number;
  quantity: number;
  upc?: string;
  product_type: { id: number; name: string; image: string };
  feature_values: Array<{
    feature_type: { id: number; name: string };
    id: number;
    name: string;
  }>;
  images: string[];
  created_on: string;
  updated_on: string;
}

export interface IProductResponseData {
  data: IProductResponseItem;
}

// FOR PRODUCT TYPE
export interface IProductForProductTypeResponseItem {
  discount: number;
  feature_values: Array<{
    feature_type: { id: number; name: string };
    id: number;
    name: string;
  }>;
  id: number;
  images: string[];
  price: number;
  product_type: {
    category: number;
    feature_types: number[];
    id: number;
    name: string;
    slug: string;
    image: string;
  };
  quantity: number;
  upc?: string;
  created_on: string;
  updated_on: string;
}

export interface IProductForProductTypeResponseData {
  data: IProductForProductTypeResponseItem[];
}

// PAYLOADS
export interface IProductCreatePayload {
  discount: number;
  price: number;
  quantity: number;
  product_type_id: number;
  images?: Array<File | string>;
  upc?: string;
}

export type IProductEditPayload = IProductCreatePayload;

export interface IProductAPI {
  getAll(page: number): Promise<IProductListResponseData>;
  getForCart(ids: number[]): Promise<IProductListResponseData>;
  delete(id: number): Promise<{}>;
  create(payload: IProductCreatePayload): Promise<IProductResponseData>;
  edit(id: number, payload: IProductEditPayload): Promise<IProductResponseData>;
  status(id: number): Promise<{}>;
  getOne(id: number): Promise<IProductResponseData>;
  getForProductType(productTypeID: number): Promise<IProductForProductTypeResponseData>;
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

  public async getAll(page: number) {
    try {
      const response = await this.client.get<IProductListResponseData>(`/api/products${buildQueryString({ page })}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async getForCart(ids: number[]) {
    try {
      const response = await this.client.get<IProductListResponseData>(`/api/products${buildQueryString({ ids })}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async delete(id: number) {
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
  }

  public async create({ images, ...json }: IProductCreatePayload) {
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
  }

  public async edit(id: number, { images, ...json }: IProductEditPayload) {
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
  }

  public async status(id: number) {
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
  }

  public async getOne(id: number) {
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
  }

  public async getForProductType(productTypeID: number) {
    const response = await this.client.get<IProductForProductTypeResponseData>(
      `/api/product_types/${productTypeID}/products`,
      { headers: this.headersManager.getHeaders() },
    );
    return response.data;
  }
}
