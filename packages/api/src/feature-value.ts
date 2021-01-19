import { APIClient } from '@eye8/api/client';
import { FeatureTypeListRawIntlResponseItem, FeatureTypeListResponseItem } from '@eye8/api/feature-type';
import { HeadersManager } from '@eye8/manager/headers';
import { buildSearchString } from '@eye8/shared/utils';

export interface FeatureValueListResponseItem {
  id: number;
  name: string;
  feature_type: FeatureTypeListResponseItem;
  created_on: string;
  updated_on: string;
}

export interface FeatureValueListRawIntlResponseItem {
  id: number;
  name: {
    [key: string]: string;
  };
  feature_type: FeatureTypeListRawIntlResponseItem;
  created_on: string;
  updated_on: string;
}

export interface FeatureValueListResponseData {
  data: FeatureValueListResponseItem[];
}

export interface FeatureValueListRawIntlResponseData {
  data: FeatureValueListRawIntlResponseItem[];
}

export interface FeatureValueRawIntlResponseData {
  data: FeatureValueListRawIntlResponseItem;
}

export interface FeatureValueCreatePayload {
  names: {
    [key: string]: string;
  };
  feature_type_id: number;
}

export interface FeatureValueEditPayload {
  names: {
    [key: string]: string;
  };
  feature_type_id: number;
}

export interface FeatureValueAPI {
  getAll(): Promise<FeatureValueListResponseData>;
  getAllRawIntl(): Promise<FeatureValueListRawIntlResponseData>;
  delete(id: number): Promise<{}>;
  create(payload: FeatureValueCreatePayload): Promise<FeatureValueRawIntlResponseData>;
  edit(id: number, payload: FeatureValueEditPayload): Promise<FeatureValueRawIntlResponseData>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<FeatureValueRawIntlResponseData>;
}

export class FeatureValueNotFound extends Error {
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
      const response = await this.client.get<FeatureValueListResponseData>('/api/feature_values', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: FeatureValueAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<FeatureValueListRawIntlResponseData>(
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
        throw new FeatureValueNotFound();
      }
      throw e;
    }
  };

  public create: FeatureValueAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<FeatureValueRawIntlResponseData>(`/api/feature_values`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: FeatureValueAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<FeatureValueRawIntlResponseData>(
        `/api/feature_values/${id}${buildSearchString({ raw_intl: 1 })}`,
        payload,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new FeatureValueNotFound();
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
        throw new FeatureValueNotFound();
      }
      throw e;
    }
  };

  public getOneRawIntl: FeatureValueAPI['getOneRawIntl'] = async (id) => {
    try {
      const response = await this.client.get<FeatureValueRawIntlResponseData>(
        `/api/feature_values/${id}${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new FeatureValueNotFound();
      }
      throw e;
    }
  };
}
