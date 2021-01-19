import { CharacteristicListRawIntlResponseItem, CharacteristicListResponseItem } from '@eye8/api/characteristic';
import { APIClient } from '@eye8/api/client';
import { HeadersManager } from '@eye8/manager/headers';
import { buildSearchString } from '@eye8/shared/utils';

export interface CharacteristicValueListResponseItem {
  id: number;
  name: string;
  characteristic: CharacteristicListResponseItem;
  created_on: string;
  updated_on: string;
}

export interface CharacteristicValueListRawIntlResponseItem {
  id: number;
  name: {
    [key: string]: string;
  };
  characteristic: CharacteristicListRawIntlResponseItem;
  created_on: string;
  updated_on: string;
}

export interface CharacteristicValueListResponseData {
  data: CharacteristicValueListResponseItem[];
}

export interface CharacteristicValueListRawIntlResponseData {
  data: CharacteristicValueListRawIntlResponseItem[];
}

export interface CharacteristicValueRawIntlResponseData {
  data: CharacteristicValueListRawIntlResponseItem;
}

export interface CharacteristicValueCreatePayload {
  names: {
    [key: string]: string;
  };
  characteristic_id: number;
}

export interface CharacteristicValueEditPayload {
  names: {
    [key: string]: string;
  };
  characteristic_id: number;
}

export interface CharacteristicValueAPI {
  getAll(): Promise<CharacteristicValueListResponseData>;
  getAllRawIntl(): Promise<CharacteristicValueListRawIntlResponseData>;
  delete(id: number): Promise<{}>;
  create(payload: CharacteristicValueCreatePayload): Promise<CharacteristicValueRawIntlResponseData>;
  edit(id: number, payload: CharacteristicValueEditPayload): Promise<CharacteristicValueRawIntlResponseData>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<CharacteristicValueRawIntlResponseData>;
}

export class CharacteristicValueNotFoundError extends Error {
  constructor() {
    super('Characteristic value not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements CharacteristicValueAPI {
  private client: APIClient;
  private headersManager: HeadersManager;

  constructor(client: APIClient, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: CharacteristicValueAPI['getAll'] = async () => {
    try {
      const response = await this.client.get<CharacteristicValueListResponseData>('/api/characteristic_values', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: CharacteristicValueAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<CharacteristicValueListRawIntlResponseData>(
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

  public delete: CharacteristicValueAPI['delete'] = async (id) => {
    try {
      const response = await this.client.delete<{}>(`/api/characteristic_values/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new CharacteristicValueNotFoundError();
      }
      throw e;
    }
  };

  public create: CharacteristicValueAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<CharacteristicValueRawIntlResponseData>(
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

  public edit: CharacteristicValueAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<CharacteristicValueRawIntlResponseData>(
        `/api/characteristic_values/${id}${buildSearchString({ raw_intl: 1 })}`,
        payload,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new CharacteristicValueNotFoundError();
      }
      throw e;
    }
  };

  public status: CharacteristicValueAPI['status'] = async (id) => {
    try {
      const response = await this.client.head<{}>(`/api/characteristic_values/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new CharacteristicValueNotFoundError();
      }
      throw e;
    }
  };

  public getOneRawIntl: CharacteristicValueAPI['getOneRawIntl'] = async (id: number) => {
    try {
      const response = await this.client.get<CharacteristicValueRawIntlResponseData>(
        `/api/characteristic_values/${id}${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new CharacteristicValueNotFoundError();
      }
      throw e;
    }
  };
}
