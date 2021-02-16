import { HeadersManager } from '@eye8/manager/headers';
import { flagToSearchStringValue, buildSearchString } from '@eye8/shared/utils';

import { PromoCode, APIClient } from './types';

export interface CreatePayload {
  discount: number;
  amount?: number;
  value: string;
  is_active: boolean;
  disable_on_use: boolean;
  products: number[];
}

export interface EditPayload {
  is_active: boolean;
  disable_on_use: boolean;
  products: number[];
}

export interface GetOneOptions {
  deleted?: boolean;
}

interface PromoCodeAPI {
  getAll(deleted?: boolean): Promise<{ data: PromoCode[] }>;
  getOne(id: number, options: GetOneOptions): Promise<{ data: PromoCode }>;
  getByValue(value: string): Promise<{ data: PromoCode }>;
  delete(id: number, forever?: boolean): Promise<{}>;
  create(payload: CreatePayload): Promise<{ data: PromoCode }>;
  edit(id: number, payload: EditPayload): Promise<{ data: PromoCode }>;
  status(id: number, deleted?: boolean): Promise<{}>;
}

export class NotFoundError extends Error {
  constructor() {
    super('Promo code not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class ValueDuplicatedError extends Error {
  constructor() {
    super('Promo code not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class DeletionWithOrdersError extends Error {
  constructor() {
    super('Promo code with orders is untouchable');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements PromoCodeAPI {
  private client: APIClient;
  private headersManager: HeadersManager;

  constructor(client: APIClient, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: PromoCodeAPI['getAll'] = async (deleted = false) => {
    try {
      const response = await this.client.get<{ data: PromoCode[] }>(
        `/api/promo_codes${buildSearchString({ deleted: flagToSearchStringValue(deleted) })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public delete: PromoCodeAPI['delete'] = async (id, forever = false) => {
    try {
      const response = await this.client.delete<{}>(
        `/api/promo_codes/${id}${buildSearchString({ forever: flagToSearchStringValue(forever) })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
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

  public create: PromoCodeAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<{ data: PromoCode }>(`/api/promo_codes`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response.data.value) {
        throw new ValueDuplicatedError();
      }
      throw e;
    }
  };

  public edit: PromoCodeAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<{ data: PromoCode }>(`/api/promo_codes/${id}`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new NotFoundError();
      }
      if (e.response && e.response.data.value) {
        throw new ValueDuplicatedError();
      }
      if (e.response && e.response.data.orders) {
        throw new DeletionWithOrdersError();
      }
      throw e;
    }
  };

  public getOne: PromoCodeAPI['getOne'] = async (id, options) => {
    try {
      const response = await this.client.get<{ data: PromoCode }>(
        `/api/promo_codes/${id}${buildSearchString({ deleted: flagToSearchStringValue(options.deleted) })}`,
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

  public getByValue: PromoCodeAPI['getByValue'] = async (value) => {
    try {
      const response = await this.client.get<{ data: PromoCode }>(`/api/promo_codes/${value}`, {
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

  public status: PromoCodeAPI['status'] = async (id, deleted = false) => {
    try {
      const response = await this.client.head<{}>(
        `/api/promo_codes/${id}${buildSearchString({ deleted: flagToSearchStringValue(deleted) })}`,
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
