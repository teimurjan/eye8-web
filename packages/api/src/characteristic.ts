import { Client } from '@eye8/api/types';
import { HeadersManager } from '@eye8/manager/headers';
import { buildSearchString } from '@eye8/shared/utils';

export interface CharacteristicListResponseItem {
  id: number;
  name: string;
  created_on: string;
  updated_on: string;
}

export interface CharacteristicListRawIntlResponseItem {
  id: number;
  name: {
    [key: string]: string;
  };
  created_on: string;
  updated_on: string;
}

export interface CharacteristicListResponseData {
  data: CharacteristicListResponseItem[];
}

export interface CharacteristicListRawIntlResponseData {
  data: CharacteristicListRawIntlResponseItem[];
}

export interface CharacteristicRawIntlResponseData {
  data: CharacteristicListRawIntlResponseItem;
}

export interface CharacteristicCreatePayload {
  names: {
    [key: string]: string;
  };
}

export interface CharacteristicEditPayload {
  names: {
    [key: string]: string;
  };
}

export interface CharacteristicAPI {
  getAll(): Promise<CharacteristicListResponseData>;
  getAllRawIntl(): Promise<CharacteristicListRawIntlResponseData>;
  delete(id: number): Promise<{}>;
  create(payload: CharacteristicCreatePayload): Promise<CharacteristicRawIntlResponseData>;
  edit(id: number, payload: CharacteristicEditPayload): Promise<CharacteristicRawIntlResponseData>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<CharacteristicRawIntlResponseData>;
}

export class CharacteristicNotFoundError extends Error {
  constructor() {
    super('Characteristic not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements CharacteristicAPI {
  private client: Client;
  private headersManager: HeadersManager;

  constructor(client: Client, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: CharacteristicAPI['getAll'] = async () => {
    try {
      const response = await this.client.get<CharacteristicListResponseData>('/api/characteristics', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: CharacteristicAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<CharacteristicListRawIntlResponseData>(
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

  public delete: CharacteristicAPI['delete'] = async (id) => {
    try {
      const response = await this.client.delete<{}>(`/api/characteristics/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new CharacteristicNotFoundError();
      }
      throw e;
    }
  };

  public create: CharacteristicAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<CharacteristicRawIntlResponseData>(`/api/characteristics`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: CharacteristicAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<CharacteristicRawIntlResponseData>(
        `/api/characteristics/${id}${buildSearchString({ raw_intl: 1 })}`,
        payload,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new CharacteristicNotFoundError();
      }
      throw e;
    }
  };

  public status: CharacteristicAPI['status'] = async (id) => {
    try {
      const response = await this.client.head<{}>(`/api/characteristics/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new CharacteristicNotFoundError();
      }
      throw e;
    }
  };

  public getOneRawIntl: CharacteristicAPI['getOneRawIntl'] = async (id) => {
    try {
      const response = await this.client.get<CharacteristicRawIntlResponseData>(
        `/api/characteristics/${id}${buildSearchString({ raw_intl: 1 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new CharacteristicNotFoundError();
      }
      throw e;
    }
  };
}
