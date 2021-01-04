import { Client } from '@eye8/api/types';
import { IHeadersManager } from '@eye8/manager/headers';
import { buildSearchString } from '@eye8/shared/utils';

export interface ICategoryListResponseItem {
  id: number;
  name: string;
  parent_category_id: number | null;
  slug: string;
  created_on: string;
  updated_on: string;
}

export interface ICategoryListRawIntlResponseItem {
  id: number;
  name: {
    [key: string]: string;
  };
  parent_category_id: number | null;
  slug: string;
  created_on: string;
  updated_on: string;
}

export interface ICategoryListResponseData {
  data: ICategoryListResponseItem[];
}

export interface ICategoryDetailResponseData {
  data: ICategoryListResponseItem;
}

export interface ICategoryListRawIntlResponseData {
  data: ICategoryListRawIntlResponseItem[];
}

export interface ICategoryRawIntlResponseData {
  data: ICategoryListRawIntlResponseItem;
}

export interface ICategoryCreatePayload {
  names: {
    [key: string]: string;
  };
  parent_category_id?: number;
}

export interface ICategoryAPI {
  getAll(): Promise<ICategoryListResponseData>;
  getAllRawIntl(): Promise<ICategoryListRawIntlResponseData>;
  delete(id: number): Promise<{}>;
  create(payload: ICategoryCreatePayload): Promise<ICategoryRawIntlResponseData>;
  edit(id: number, payload: ICategoryCreatePayload): Promise<ICategoryRawIntlResponseData>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<ICategoryRawIntlResponseData>;
  getOne(id: number): Promise<ICategoryDetailResponseData>;
  getOneBySlug(slug: string): Promise<ICategoryDetailResponseData>;
}

export class CategoryNotFoundError extends Error {
  constructor() {
    super('Category not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class CategoryWithChildrenNotDeletedError extends Error {
  constructor() {
    super('Category with children cannot be deleted');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class CategoryWithProductTypesNotDeletedError extends Error {
  constructor() {
    super('Category with product types cannot be deleted');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class CategoryAPI implements ICategoryAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: ICategoryAPI['getAll'] = async () => {
    try {
      const response = await this.client.get<ICategoryListResponseData>('/api/categories', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: ICategoryAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<ICategoryListRawIntlResponseData>(
        `/api/categories${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public delete: ICategoryAPI['delete'] = async (id) => {
    try {
      const response = await this.client.delete<{}>(`/api/categories/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new CategoryNotFoundError();
      }
      if (e.response.data.children) {
        throw new CategoryWithChildrenNotDeletedError();
      }
      if (e.response.data.product_types) {
        throw new CategoryWithProductTypesNotDeletedError();
      }

      throw e;
    }
  };

  public status: ICategoryAPI['status'] = async (id) => {
    try {
      const response = await this.client.head<{}>(`/api/categories/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new CategoryNotFoundError();
      }
      throw e;
    }
  };

  public create: ICategoryAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<ICategoryRawIntlResponseData>(`/api/categories`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: ICategoryAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<ICategoryRawIntlResponseData>(
        `/api/categories/${id}${buildSearchString({ raw_intl: 1 })}`,
        payload,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new CategoryNotFoundError();
      }
      throw e;
    }
  };

  public getOneRawIntl: ICategoryAPI['getOneRawIntl'] = async (id) => {
    try {
      const response = await this.client.get<ICategoryRawIntlResponseData>(
        `/api/categories/${id}${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new CategoryNotFoundError();
      }
      throw e;
    }
  };

  public getOneBySlug: ICategoryAPI['getOneBySlug'] = async (slug) => {
    try {
      const response = await this.client.get<ICategoryDetailResponseData>(`/api/categories/${slug}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new CategoryNotFoundError();
      }
      throw e;
    }
  };

  public getOne: ICategoryAPI['getOne'] = async (id) => {
    return this.getOneBySlug(id.toString());
  };
}
