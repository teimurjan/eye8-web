import { HeadersManager } from '@eye8/manager/headers';
import { buildSearchString } from '@eye8/shared/utils';

import { FeatureType, APIClient } from './types';

export interface CreatePayload {
  names: {
    [key: string]: string;
  };
}

export interface EditPayload {
  names: {
    [key: string]: string;
  };
}

interface FeatureTypeAPI {
  getAll(): Promise<{ data: FeatureType[] }>;
  getAllRawIntl(): Promise<{ data: FeatureType<true>[] }>;
  delete(id: number): Promise<{}>;
  create(payload: CreatePayload): Promise<{ data: FeatureType<true> }>;
  edit(id: number, payload: EditPayload): Promise<{ data: FeatureType<true> }>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<{ data: FeatureType<true> }>;
}

export class NotFoundError extends Error {
  constructor() {
    super('Feature type not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements FeatureTypeAPI {
  private client: APIClient;
  private headersManager: HeadersManager;

  constructor(client: APIClient, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: FeatureTypeAPI['getAll'] = async () => {
    try {
      const response = await this.client.get<{ data: FeatureType[] }>('/api/feature_types', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: FeatureTypeAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<{ data: FeatureType<true>[] }>(
        `/api/feature_types${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public delete: FeatureTypeAPI['delete'] = async (id) => {
    try {
      const response = await this.client.delete<{}>(`/api/feature_types/${id}`, {
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

  public create: FeatureTypeAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<{ data: FeatureType<true> }>(`/api/feature_types`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: FeatureTypeAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<{ data: FeatureType<true> }>(
        `/api/feature_types/${id}${buildSearchString({ raw_intl: 1 })}`,
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

  public status: FeatureTypeAPI['status'] = async (id) => {
    try {
      const response = await this.client.head<{}>(`/api/feature_types/${id}`, {
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

  public getOneRawIntl: FeatureTypeAPI['getOneRawIntl'] = async (id) => {
    try {
      const response = await this.client.get<{ data: FeatureType<true> }>(
        `/api/feature_types/${id}${buildSearchString({ raw_intl: 1 })}`,
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
