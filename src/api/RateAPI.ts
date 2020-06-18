import { Client } from 'ttypes/http';

import { IHeadersManager } from 'src/manager/HeadersManager';

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

export const errors = {
  LimitExceeded: class extends Error {
    constructor() {
      super('Creation limit exceeded');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  RateWithOrdersIsUntouchable: class extends Error {
    constructor() {
      super('Rate with orders is untouchable');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  RateNotFound: class extends Error {
    constructor() {
      super('Rate not found');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

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

  public async getAll() {
    try {
      const response = await this.client.get<IRateListResponseData>('/api/currency_rates', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.data.limit) {
        throw new errors.LimitExceeded();
      }
      throw e;
    }
  }

  public async delete(id: number) {
    try {
      await this.client.delete<{}>(`/api/currency_rates/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.RateNotFound();
      }
      if (e.response && e.response.data.orders) {
        throw new errors.RateWithOrdersIsUntouchable();
      }
      throw e;
    }
  }

  public async status(id: number) {
    try {
      await this.client.head<{}>(`/api/currency_rates/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.RateNotFound();
      }
      throw e;
    }
  }

  public async create(payload: IRatesCreatePayload) {
    try {
      const response = await this.client.post<IRateDetailResponseData>('/api/currency_rates', payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }
}
