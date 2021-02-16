import { HeadersManager } from '@eye8/manager/headers';

import { Rate, APIClient } from './types';

export interface CreatePayload {
  name: string;
  value: number;
}

export class CreationNotAllowedError extends Error {
  constructor() {
    super('Creation limit exceeded');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class DeletionWithOrdersError extends Error {
  constructor() {
    super('Rate with orders is untouchable');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class NotFoundError extends Error {
  constructor() {
    super('Rate not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

interface RateAPI {
  getAll(): Promise<{ data: Rate[] }>;
  delete(id: number): Promise<void>;
  status(id: number): Promise<void>;
  create(payload: CreatePayload): Promise<{ data: Rate }>;
}

export default class implements RateAPI {
  private client: APIClient;
  private headersManager: HeadersManager;

  constructor(client: APIClient, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: RateAPI['getAll'] = async () => {
    const response = await this.client.get<{ data: Rate[] }>('/api/currency_rates', {
      headers: this.headersManager.getHeaders(),
    });
    return response.data;
  };

  public delete: RateAPI['delete'] = async (id) => {
    try {
      await this.client.delete<{}>(`/api/currency_rates/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new NotFoundError();
      }
      if (e.response && e.response.data.orders) {
        throw new DeletionWithOrdersError();
      }
      throw e;
    }
  };

  public status: RateAPI['status'] = async (id) => {
    try {
      await this.client.head<{}>(`/api/currency_rates/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new NotFoundError();
      }
      throw e;
    }
  };

  public create: RateAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<{ data: Rate }>('/api/currency_rates', payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.data.limit) {
        throw new CreationNotAllowedError();
      }
      throw e;
    }
  };
}
