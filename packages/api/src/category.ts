import { HeadersManager } from '@eye8/manager/headers';
import { buildSearchString } from '@eye8/shared/utils';

import { Category, APIClient } from './types';

export interface CreatePayload {
  names: {
    [key: string]: string;
  };
  parent_category_id?: number;
}

interface CategoryAPI {
  getAll(): Promise<{ data: Category[] }>;
  getAllRawIntl(): Promise<{ data: Category<true>[] }>;
  delete(id: number): Promise<{}>;
  create(payload: CreatePayload): Promise<{ data: Category<true> }>;
  edit(id: number, payload: CreatePayload): Promise<{ data: Category<true> }>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<{ data: Category<true> }>;
  getOne(id: number): Promise<{ data: Category }>;
  getOneBySlug(slug: string): Promise<{ data: Category }>;
}

export class NotFoundError extends Error {
  constructor() {
    super('Category not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class DeletionWithChildrenError extends Error {
  constructor() {
    super('Category with children cannot be deleted');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class DeletionWithProductTypesError extends Error {
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
      const response = await this.client.get<{ data: Category[] }>('/api/categories', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: CategoryAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<{ data: Category<true>[] }>(
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
        throw new NotFoundError();
      }
      if (e.response.data.children) {
        throw new DeletionWithChildrenError();
      }
      if (e.response.data.product_types) {
        throw new DeletionWithProductTypesError();
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
        throw new NotFoundError();
      }
      throw e;
    }
  };

  public create: CategoryAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<{ data: Category<true> }>(`/api/categories`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: CategoryAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<{ data: Category<true> }>(
        `/api/categories/${id}${buildSearchString({ raw_intl: 1 })}`,
        payload,
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

  public getOneRawIntl: CategoryAPI['getOneRawIntl'] = async (id) => {
    try {
      const response = await this.client.get<{ data: Category<true> }>(
        `/api/categories/${id}${buildSearchString({ raw_intl: 1 })}`,
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

  public getOneBySlug: CategoryAPI['getOneBySlug'] = async (slug) => {
    try {
      const response = await this.client.get<{ data: Category }>(`/api/categories/${slug}`, {
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

  public getOne: CategoryAPI['getOne'] = async (id) => {
    return this.getOneBySlug(id.toString());
  };
}
