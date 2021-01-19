import { APIClient } from '@eye8/api/client';
import { HeadersManager } from '@eye8/manager/headers';

export interface RateListResponseItem {
  id: number;
  name: string;
  value: number;
  created_on: string;
  updated_on: string;
  is_deleted: boolean | null;
}

export interface RateListResponseData {
  data: RateListResponseItem[];
}

export interface RateDetailResponseData {
  data: RateListResponseItem;
}

export interface RatesCreatePayload {
  name: string;
  value: number;
}

export class RateCreationNotAllowedError extends Error {
  constructor() {
    super('Creation limit exceeded');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class RateWithOrdersNotDeletedError extends Error {
  constructor() {
    super('Rate with orders is untouchable');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class RateNotFoundError extends Error {
  constructor() {
    super('Rate not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface RateAPI {
  getAll(): Promise<RateListResponseData>;
  delete(id: number): Promise<void>;
  status(id: number): Promise<void>;
  create(payload: RatesCreatePayload): Promise<RateDetailResponseData>;
}

export default class implements RateAPI {
  private client: APIClient;
  private headersManager: HeadersManager;

  constructor(client: APIClient, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: RateAPI['getAll'] = async () => {
    const response = await this.client.get<RateListResponseData>('/api/currency_rates', {
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
        throw new RateNotFoundError();
      }
      if (e.response && e.response.data.orders) {
        throw new RateWithOrdersNotDeletedError();
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
        throw new RateNotFoundError();
      }
      throw e;
    }
  };

  public create: RateAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<RateDetailResponseData>('/api/currency_rates', payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.data.limit) {
        throw new RateCreationNotAllowedError();
      }
      throw e;
    }
  };
}
