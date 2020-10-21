import { Client } from 'ttypes/http';

import { IHeadersManager } from 'src/manager/HeadersManager';
import { buildSearchString } from 'src/utils/searchString';

export interface ICharacteristicListResponseItem {
  id: number;
  name: string;
  created_on: string;
  updated_on: string;
}

export interface ICharacteristicListRawIntlResponseItem {
  id: number;
  name: {
    [key: string]: string;
  };
  created_on: string;
  updated_on: string;
}

export interface ICharacteristicListResponseData {
  data: ICharacteristicListResponseItem[];
}

export interface ICharacteristicListRawIntlResponseData {
  data: ICharacteristicListRawIntlResponseItem[];
}

export interface ICharacteristicRawIntlResponseData {
  data: ICharacteristicListRawIntlResponseItem;
}

export interface ICharacteristicCreatePayload {
  names: {
    [key: string]: string;
  };
}

export interface ICharacteristicEditPayload {
  names: {
    [key: string]: string;
  };
}

export interface ICharacteristicAPI {
  getAll(): Promise<ICharacteristicListResponseData>;
  getAllRawIntl(): Promise<ICharacteristicListRawIntlResponseData>;
  delete(id: number): Promise<{}>;
  create(payload: ICharacteristicCreatePayload): Promise<ICharacteristicRawIntlResponseData>;
  edit(id: number, payload: ICharacteristicEditPayload): Promise<ICharacteristicRawIntlResponseData>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<ICharacteristicRawIntlResponseData>;
}

export const errors = {
  CharacteristicNotFound: class extends Error {
    constructor() {
      super('Characteristic not found');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class CharacteristicAPI implements ICharacteristicAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: ICharacteristicAPI['getAll'] = async () => {
    try {
      const response = await this.client.get<ICharacteristicListResponseData>('/api/characteristics', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: ICharacteristicAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<ICharacteristicListRawIntlResponseData>(
        `/api/characteristics${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public delete: ICharacteristicAPI['delete'] = async (id) => {
    try {
      const response = await this.client.delete<{}>(`/api/characteristics/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.CharacteristicNotFound();
      }
      throw e;
    }
  };

  public create: ICharacteristicAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<ICharacteristicRawIntlResponseData>(`/api/characteristics`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: ICharacteristicAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<ICharacteristicRawIntlResponseData>(
        `/api/characteristics/${id}${buildSearchString({ raw_intl: 1 })}`,
        payload,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.CharacteristicNotFound();
      }
      throw e;
    }
  };

  public status: ICharacteristicAPI['status'] = async (id) => {
    try {
      const response = await this.client.head<{}>(`/api/characteristics/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.CharacteristicNotFound();
      }
      throw e;
    }
  };

  public getOneRawIntl: ICharacteristicAPI['getOneRawIntl'] = async (id) => {
    try {
      const response = await this.client.get<ICharacteristicRawIntlResponseData>(
        `/api/characteristics/${id}${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.CharacteristicNotFound();
      }
      throw e;
    }
  };
}
