import { Client } from '@eye8/api/types';
import { HeadersManager } from '@eye8/manager/headers';
import { buildSearchString } from '@eye8/shared/utils';

export interface FeatureTypeListResponseItem {
  id: number;
  name: string;
  created_on: string;
  updated_on: string;
}

export interface FeatureTypeListRawIntlResponseItem {
  id: number;
  name: {
    [key: string]: string;
  };
  created_on: string;
  updated_on: string;
}

export interface FeatureTypeListResponseData {
  data: FeatureTypeListResponseItem[];
}

export interface FeatureTypeListRawIntlResponseData {
  data: FeatureTypeListRawIntlResponseItem[];
}

export interface FeatureTypeRawIntlResponseData {
  data: FeatureTypeListRawIntlResponseItem;
}

export interface FeatureTypeCreatePayload {
  names: {
    [key: string]: string;
  };
}

export interface FeatureTypeEditPayload {
  names: {
    [key: string]: string;
  };
}

export interface FeatureTypeAPI {
  getAll(): Promise<FeatureTypeListResponseData>;
  getAllRawIntl(): Promise<FeatureTypeListRawIntlResponseData>;
  delete(id: number): Promise<{}>;
  create(payload: FeatureTypeCreatePayload): Promise<FeatureTypeRawIntlResponseData>;
  edit(id: number, payload: FeatureTypeEditPayload): Promise<FeatureTypeRawIntlResponseData>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<FeatureTypeRawIntlResponseData>;
}

export class FeatureTypeNotFoundError extends Error {
  constructor() {
    super('Feature type not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements FeatureTypeAPI {
  private client: Client;
  private headersManager: HeadersManager;

  constructor(client: Client, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: FeatureTypeAPI['getAll'] = async () => {
    try {
      const response = await this.client.get<FeatureTypeListResponseData>('/api/feature_types', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: FeatureTypeAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<FeatureTypeListRawIntlResponseData>(
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
        throw new FeatureTypeNotFoundError();
      }
      throw e;
    }
  };

  public create: FeatureTypeAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<FeatureTypeRawIntlResponseData>(`/api/feature_types`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: FeatureTypeAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<FeatureTypeRawIntlResponseData>(
        `/api/feature_types/${id}${buildSearchString({ raw_intl: 1 })}`,
        payload,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new FeatureTypeNotFoundError();
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
        throw new FeatureTypeNotFoundError();
      }
      throw e;
    }
  };

  public getOneRawIntl: FeatureTypeAPI['getOneRawIntl'] = async (id) => {
    try {
      const response = await this.client.get<FeatureTypeRawIntlResponseData>(
        `/api/feature_types/${id}${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new FeatureTypeNotFoundError();
      }
      throw e;
    }
  };
}
