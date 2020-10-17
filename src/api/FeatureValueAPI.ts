import { Client } from 'ttypes/http';

import { IFeatureTypeListRawIntlResponseItem, IFeatureTypeListResponseItem } from 'src/api/FeatureTypeAPI';
import { IHeadersManager } from 'src/manager/HeadersManager';
import { buildSearchString } from 'src/utils/queryString';

export interface IFeatureValueListResponseItem {
  id: number;
  name: string;
  feature_type: IFeatureTypeListResponseItem;
  created_on: string;
  updated_on: string;
}

export interface IFeatureValueListRawIntlResponseItem {
  id: number;
  name: {
    [key: string]: string;
  };
  feature_type: IFeatureTypeListRawIntlResponseItem;
  created_on: string;
  updated_on: string;
}

export interface IFeatureValueListResponseData {
  data: IFeatureValueListResponseItem[];
}

export interface IFeatureValueListRawIntlResponseData {
  data: IFeatureValueListRawIntlResponseItem[];
}

export interface IFeatureValueRawIntlResponseData {
  data: IFeatureValueListRawIntlResponseItem;
}

export interface IFeatureValueCreatePayload {
  names: {
    [key: string]: string;
  };
  feature_type_id: number;
}

export interface IFeatureValueEditPayload {
  names: {
    [key: string]: string;
  };
  feature_type_id: number;
}

export interface IFeatureValueAPI {
  getAll(): Promise<IFeatureValueListResponseData>;
  getAllRawIntl(): Promise<IFeatureValueListRawIntlResponseData>;
  delete(id: number): Promise<{}>;
  create(payload: IFeatureValueCreatePayload): Promise<IFeatureValueRawIntlResponseData>;
  edit(id: number, payload: IFeatureValueEditPayload): Promise<IFeatureValueRawIntlResponseData>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<IFeatureValueRawIntlResponseData>;
}

export const errors = {
  FeatureValueNotFound: class extends Error {
    constructor() {
      super('Feature value not found');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class FeatureValueAPI implements IFeatureValueAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: IFeatureValueAPI['getAll'] = async () => {
    try {
      const response = await this.client.get<IFeatureValueListResponseData>('/api/feature_values', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: IFeatureValueAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<IFeatureValueListRawIntlResponseData>(
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

  public delete: IFeatureValueAPI['delete'] = async (id) => {
    try {
      const response = await this.client.delete<{}>(`/api/feature_values/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.FeatureValueNotFound();
      }
      throw e;
    }
  };

  public create: IFeatureValueAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<IFeatureValueRawIntlResponseData>(`/api/feature_values`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: IFeatureValueAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<IFeatureValueRawIntlResponseData>(
        `/api/feature_values/${id}${buildSearchString({ raw_intl: 1 })}`,
        payload,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.FeatureValueNotFound();
      }
      throw e;
    }
  };

  public status: IFeatureValueAPI['status'] = async (id) => {
    try {
      const response = await this.client.head<{}>(`/api/feature_values/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.FeatureValueNotFound();
      }
      throw e;
    }
  };

  public getOneRawIntl: IFeatureValueAPI['getOneRawIntl'] = async (id) => {
    try {
      const response = await this.client.get<IFeatureValueRawIntlResponseData>(
        `/api/feature_values/${id}${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.FeatureValueNotFound();
      }
      throw e;
    }
  };
}
