import { HeadersManager } from '@eye8/manager/headers';
import { buildSearchString } from '@eye8/shared/utils';

import { CharacteristicValue, APIClient } from './types';

export interface CreatePayload {
  names: {
    [key: string]: string;
  };
  characteristic_id: number;
}

export interface EditPayload {
  names: {
    [key: string]: string;
  };
  characteristic_id: number;
}

interface CharacteristicValueAPI {
  getAll(): Promise<{ data: CharacteristicValue[] }>;
  getAllRawIntl(): Promise<{ data: CharacteristicValue<true>[] }>;
  getForCharacteristicRawIntl(characteristicId: number): Promise<{ data: CharacteristicValue<true>[] }>;
  delete(id: number): Promise<{}>;
  create(payload: CreatePayload): Promise<{ data: CharacteristicValue<true> }>;
  edit(id: number, payload: EditPayload): Promise<{ data: CharacteristicValue<true> }>;
  status(id: number): Promise<{}>;
  getOneRawIntl(id: number): Promise<{ data: CharacteristicValue<true> }>;
}

export class NotFoundError extends Error {
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
      const response = await this.client.get<{ data: CharacteristicValue[] }>('/api/characteristic_values', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getForCharacteristicRawIntl: CharacteristicValueAPI['getForCharacteristicRawIntl'] = async (
    characteristicId,
  ) => {
    try {
      const response = await this.client.get<{ data: CharacteristicValue<true>[] }>(
        `/api/characteristics/${characteristicId}/characteristic_values`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getAllRawIntl: CharacteristicValueAPI['getAllRawIntl'] = async () => {
    try {
      const response = await this.client.get<{ data: CharacteristicValue<true>[] }>(
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
        throw new NotFoundError();
      }
      throw e;
    }
  };

  public create: CharacteristicValueAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<{ data: CharacteristicValue<true> }>(
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
      const response = await this.client.put<{ data: CharacteristicValue<true> }>(
        `/api/characteristic_values/${id}${buildSearchString({ raw_intl: 1 })}`,
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

  public status: CharacteristicValueAPI['status'] = async (id) => {
    try {
      const response = await this.client.head<{}>(`/api/characteristic_values/${id}`, {
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

  public getOneRawIntl: CharacteristicValueAPI['getOneRawIntl'] = async (id: number) => {
    try {
      const response = await this.client.get<{ data: CharacteristicValue<true> }>(
        `/api/characteristic_values/${id}${buildSearchString({ raw_intl: 1 })}`,
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
