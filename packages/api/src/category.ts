import { APIClient } from '@eye8/api/client';
import { HeadersManager } from '@eye8/manager/headers';
import { buildSearchString } from '@eye8/shared/utils';

export interface CategoryListResponseItem {
  id: number;
  name: string;
  parent_category_id: number | null;
  slug: string;
  created_on: string;
  updated_on: string;
}

export interface CategoryListRawIntlResponseItem {
  id: number;
  name: {
    [key: string]: string;
  };
  parent_category_id: number | null;
  slug: string;
  created_on: string;
  updated_on: string;
}

export interface CategoryListResponseData {
  data: CategoryListResponseItem[];
}

export interface CategoryDetailResponseData {
  data: CategoryListResponseItem;
}

export interface CategoryListRawIntlResponseData {
  data: CategoryListRawIntlResponseItem[];
}

export interface CategoryRawIntlResponseData {
  data: CategoryListRawIntlResponseItem;
}

export interface CategoryCreatePayload {
  names: {
    [key: string]: string;
  };
  parent_category_id?: number;
}

export interface CategoryAPI {
  getAll(): Promise<CategoryListResponseData>;
  getAllRawIntl(): Promise<CategoryListRawIntlResponseData>;
  delete(id: number): Promise<{}>;
  create(payload: CategoryCreatePayload): Promise<CategoryRawIntlResponseData>;
  edit(id: number, payload: CategoryCreatePayload): Promise<CategoryRawIntlResponseData>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<CategoryRawIntlResponseData>;
  getOne(id: number): Promise<CategoryDetailResponseData>;
  getOneBySlug(slug: string): Promise<CategoryDetailResponseData>;
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

export default class implements CategoryAPI {
  private client: APIClient;
  private headersManager: HeadersManager;

  constructor(client: APIClient, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: CategoryAPI['getAll'] = async () => {
    try {
      const response = await this.client.get<CategoryListResponseData>('/api/categories', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: CategoryAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<CategoryListRawIntlResponseData>(
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

  public delete: CategoryAPI['delete'] = async (id) => {
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

  public status: CategoryAPI['status'] = async (id) => {
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

  public create: CategoryAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<CategoryRawIntlResponseData>(`/api/categories`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: CategoryAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<CategoryRawIntlResponseData>(
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

  public getOneRawIntl: CategoryAPI['getOneRawIntl'] = async (id) => {
    try {
      const response = await this.client.get<CategoryRawIntlResponseData>(
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

  public getOneBySlug: CategoryAPI['getOneBySlug'] = async (slug) => {
    try {
      const response = await this.client.get<CategoryDetailResponseData>(`/api/categories/${slug}`, {
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

  public getOne: CategoryAPI['getOne'] = async (id) => {
    return this.getOneBySlug(id.toString());
  };
}
