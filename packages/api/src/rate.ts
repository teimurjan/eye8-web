import { Client } from '@eye8/api/types';
import { IHeadersManager } from '@eye8/manager/headers';

export interface IRateListResponseItem {
  id: number;
  name: string;
  value: number;
  created_on: string;
  updated_on: string;
  is_deleted: boolean | null;
}

export interface IRateListResponseData {
  data: IRateListResponseItem[];
}

export interface IRateDetailResponseData {
  data: IRateListResponseItem;
}

export interface IRatesCreatePayload {
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

export interface IRateAPI {
  getAll(): Promise<IRateListResponseData>;
  delete(id: number): Promise<void>;
  status(id: number): Promise<void>;
  create(payload: IRatesCreatePayload): Promise<IRateDetailResponseData>;
}

export class RateAPI implements IRateAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: IRateAPI['getAll'] = async () => {
    const response = await this.client.get<IRateListResponseData>('/api/currency_rates', {
      headers: this.headersManager.getHeaders(),
    });
    return response.data;
  };

  public delete: IRateAPI['delete'] = async (id) => {
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

  public status: IRateAPI['status'] = async (id) => {
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

  public create: IRateAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<IRateDetailResponseData>('/api/currency_rates', payload, {
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
