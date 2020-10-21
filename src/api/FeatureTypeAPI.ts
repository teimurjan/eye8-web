import { Client } from 'ttypes/http';

import { IHeadersManager } from 'src/manager/HeadersManager';
import { buildSearchString } from 'src/utils/searchString';

export interface IFeatureTypeListResponseItem {
  id: number;
  name: string;
  created_on: string;
  updated_on: string;
}

export interface IFeatureTypeListRawIntlResponseItem {
  id: number;
  name: {
    [key: string]: string;
  };
  created_on: string;
  updated_on: string;
}

export interface IFeatureTypeListResponseData {
  data: IFeatureTypeListResponseItem[];
}

export interface IFeatureTypeListRawIntlResponseData {
  data: IFeatureTypeListRawIntlResponseItem[];
}

export interface IFeatureTypeRawIntlResponseData {
  data: IFeatureTypeListRawIntlResponseItem;
}

export interface IFeatureTypeCreatePayload {
  names: {
    [key: string]: string;
  };
}

export interface IFeatureTypeEditPayload {
  names: {
    [key: string]: string;
  };
}

export interface IFeatureTypeAPI {
  getAll(): Promise<IFeatureTypeListResponseData>;
  getAllRawIntl(): Promise<IFeatureTypeListRawIntlResponseData>;
  delete(id: number): Promise<{}>;
  create(payload: IFeatureTypeCreatePayload): Promise<IFeatureTypeRawIntlResponseData>;
  edit(id: number, payload: IFeatureTypeEditPayload): Promise<IFeatureTypeRawIntlResponseData>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<IFeatureTypeRawIntlResponseData>;
}

export const errors = {
  FeatureTypeNotFound: class extends Error {
    constructor() {
      super('Feature type not found');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class FeatureTypeAPI implements IFeatureTypeAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: IFeatureTypeAPI['getAll'] = async () => {
    try {
      const response = await this.client.get<IFeatureTypeListResponseData>('/api/feature_types', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: IFeatureTypeAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<IFeatureTypeListRawIntlResponseData>(
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

  public delete: IFeatureTypeAPI['delete'] = async (id) => {
    try {
      const response = await this.client.delete<{}>(`/api/feature_types/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.FeatureTypeNotFound();
      }
      throw e;
    }
  };

  public create: IFeatureTypeAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<IFeatureTypeRawIntlResponseData>(`/api/feature_types`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: IFeatureTypeAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<IFeatureTypeRawIntlResponseData>(
        `/api/feature_types/${id}${buildSearchString({ raw_intl: 1 })}`,
        payload,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.FeatureTypeNotFound();
      }
      throw e;
    }
  };

  public status: IFeatureTypeAPI['status'] = async (id) => {
    try {
      const response = await this.client.head<{}>(`/api/feature_types/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.FeatureTypeNotFound();
      }
      throw e;
    }
  };

  public getOneRawIntl: IFeatureTypeAPI['getOneRawIntl'] = async (id) => {
    try {
      const response = await this.client.get<IFeatureTypeRawIntlResponseData>(
        `/api/feature_types/${id}${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.FeatureTypeNotFound();
      }
      throw e;
    }
  };
}
