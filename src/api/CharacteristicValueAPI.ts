import { Client } from 'ttypes/http';

import { ICharacteristicListRawIntlResponseItem, ICharacteristicListResponseItem } from 'src/api/CharacteristicAPI';
import { IHeadersManager } from 'src/manager/HeadersManager';
import { buildSearchString } from 'src/utils/searchString';

export interface ICharacteristicValueListResponseItem {
  id: number;
  name: string;
  characteristic: ICharacteristicListResponseItem;
  created_on: string;
  updated_on: string;
}

export interface ICharacteristicValueListRawIntlResponseItem {
  id: number;
  name: {
    [key: string]: string;
  };
  characteristic: ICharacteristicListRawIntlResponseItem;
  created_on: string;
  updated_on: string;
}

export interface ICharacteristicValueListResponseData {
  data: ICharacteristicValueListResponseItem[];
}

export interface ICharacteristicValueListRawIntlResponseData {
  data: ICharacteristicValueListRawIntlResponseItem[];
}

export interface ICharacteristicValueRawIntlResponseData {
  data: ICharacteristicValueListRawIntlResponseItem;
}

export interface ICharacteristicValueCreatePayload {
  names: {
    [key: string]: string;
  };
  characteristic_id: number;
}

export interface ICharacteristicValueEditPayload {
  names: {
    [key: string]: string;
  };
  characteristic_id: number;
}

export interface ICharacteristicValueAPI {
  getAll(): Promise<ICharacteristicValueListResponseData>;
  getAllRawIntl(): Promise<ICharacteristicValueListRawIntlResponseData>;
  delete(id: number): Promise<{}>;
  create(payload: ICharacteristicValueCreatePayload): Promise<ICharacteristicValueRawIntlResponseData>;
  edit(id: number, payload: ICharacteristicValueEditPayload): Promise<ICharacteristicValueRawIntlResponseData>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<ICharacteristicValueRawIntlResponseData>;
}

export const errors = {
  CharacteristicValueNotFound: class extends Error {
    constructor() {
      super('Characteristic value not found');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class CharacteristicValueAPI implements ICharacteristicValueAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: ICharacteristicValueAPI['getAll'] = async () => {
    try {
      const response = await this.client.get<ICharacteristicValueListResponseData>('/api/characteristic_values', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: ICharacteristicValueAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<ICharacteristicValueListRawIntlResponseData>(
        `/api/characteristic_values${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );

      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public delete: ICharacteristicValueAPI['delete'] = async (id) => {
    try {
      const response = await this.client.delete<{}>(`/api/characteristic_values/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.CharacteristicValueNotFound();
      }
      throw e;
    }
  };

  public create: ICharacteristicValueAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<ICharacteristicValueRawIntlResponseData>(
        `/api/characteristic_values`,
        payload,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: ICharacteristicValueAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<ICharacteristicValueRawIntlResponseData>(
        `/api/characteristic_values/${id}${buildSearchString({ raw_intl: 1 })}`,
        payload,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.CharacteristicValueNotFound();
      }
      throw e;
    }
  };

  public status: ICharacteristicValueAPI['status'] = async (id) => {
    try {
      const response = await this.client.head<{}>(`/api/characteristic_values/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.CharacteristicValueNotFound();
      }
      throw e;
    }
  };

  public getOneRawIntl: ICharacteristicValueAPI['getOneRawIntl'] = async (id: number) => {
    try {
      const response = await this.client.get<ICharacteristicValueRawIntlResponseData>(
        `/api/characteristic_values/${id}${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.CharacteristicValueNotFound();
      }
      throw e;
    }
  };
}
