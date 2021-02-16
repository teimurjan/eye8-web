import { HeadersManager } from '@eye8/manager/headers';
import { buildSearchString } from '@eye8/shared/utils';

import { FeatureValue, APIClient } from './types';

export interface CreatePayload {
  names: {
    [key: string]: string;
  };
  feature_type_id: number;
}

export interface EditPayload {
  names: {
    [key: string]: string;
  };
  feature_type_id: number;
}

interface FeatureValueAPI {
  getAll(): Promise<{ data: FeatureValue[] }>;
  getAllRawIntl(): Promise<{ data: FeatureValue<true>[] }>;
  delete(id: number): Promise<{}>;
  create(payload: CreatePayload): Promise<{ data: FeatureValue<true> }>;
  edit(id: number, payload: EditPayload): Promise<{ data: FeatureValue<true> }>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<{ data: FeatureValue<true> }>;
}

export class NotFoundError extends Error {
  constructor() {
    super('Feature value not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements FeatureValueAPI {
  private client: APIClient;
  private headersManager: HeadersManager;

  constructor(client: APIClient, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: FeatureValueAPI['getAll'] = async () => {
    try {
      const response = await this.client.get<{ data: FeatureValue[] }>('/api/feature_values', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: FeatureValueAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<{ data: FeatureValue<true>[] }>(
        `/api/feature_values${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public delete: FeatureValueAPI['delete'] = async (id) => {
    try {
      const response = await this.client.delete<{}>(`/api/feature_values/${id}`, {
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

  public create: FeatureValueAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<{ data: FeatureValue<true> }>(`/api/feature_values`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: FeatureValueAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<{ data: FeatureValue<true> }>(
        `/api/feature_values/${id}${buildSearchString({ raw_intl: 1 })}`,
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

  public status: FeatureValueAPI['status'] = async (id) => {
    try {
      const response = await this.client.head<{}>(`/api/feature_values/${id}`, {
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

  public getOneRawIntl: FeatureValueAPI['getOneRawIntl'] = async (id) => {
    try {
      const response = await this.client.get<{ data: FeatureValue<true> }>(
        `/api/feature_values/${id}${buildSearchString({ raw_intl: 1 })}`,
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
