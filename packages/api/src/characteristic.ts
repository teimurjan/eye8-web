import { HeadersManager } from '@eye8/manager/headers';
import { buildSearchString } from '@eye8/shared/utils';

import { Characteristic, APIClient } from './types';

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

interface CharacteristicAPI {
  getAll(): Promise<{ data: Characteristic[] }>;
  getAllRawIntl(): Promise<{ data: Characteristic<true>[] }>;
  delete(id: number): Promise<{}>;
  create(payload: CreatePayload): Promise<{ data: Characteristic<true> }>;
  edit(id: number, payload: EditPayload): Promise<{ data: Characteristic<true> }>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<{ data: Characteristic<true> }>;
}

export class NotFoundError extends Error {
  constructor() {
    super('Characteristic not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements CharacteristicAPI {
  private client: APIClient;
  private headersManager: HeadersManager;

  constructor(client: APIClient, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: CharacteristicAPI['getAll'] = async () => {
    try {
      const response = await this.client.get<{ data: Characteristic[] }>('/api/characteristics', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: CharacteristicAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<{ data: Characteristic<true>[] }>(
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
        throw new NotFoundError();
      }
      throw e;
    }
  };

  public create: CharacteristicAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<{ data: Characteristic<true> }>(`/api/characteristics`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public edit: CharacteristicAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<{ data: Characteristic<true> }>(
        `/api/characteristics/${id}${buildSearchString({ raw_intl: 1 })}`,
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

  public status: CharacteristicAPI['status'] = async (id) => {
    try {
      const response = await this.client.head<{}>(`/api/characteristics/${id}`, {
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

  public getOneRawIntl: CharacteristicAPI['getOneRawIntl'] = async (id) => {
    try {
      const response = await this.client.get<{ data: Characteristic<true> }>(
        `/api/characteristics/${id}${buildSearchString({ raw_intl: 1 })}`,
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
