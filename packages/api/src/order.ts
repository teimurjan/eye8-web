import { HeadersManager } from '@eye8/manager/headers';
import { buildSearchString } from '@eye8/shared/utils';

import { Order, PaginationMeta, APIClient } from './types';

export interface CreatePayload {
  user_name: string;
  user_phone_number: string;
  user_address: string;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  promo_code?: string;
}

export interface EditPayload {
  user_name: string;
  user_phone_number: string;
  user_address: string;
  items: Array<
    | {
        product_id: number;
        quantity: number;
      }
    | number
  >;
  status: string;
  promo_code?: string;
}
interface OrderAPI {
  getAll(): Promise<{ data: Order[]; meta: PaginationMeta }>;
  getForUser(userID: number, page: number): Promise<{ data: Order[]; meta: PaginationMeta }>;
  create(payload: CreatePayload): Promise<{ data: Order }>;
  edit(orderID: number, payload: EditPayload): Promise<{ data: Order }>;
  getOne(orderID: number): Promise<{ data: Order }>;
  status(id: number): Promise<{}>;
  delete(id: number): Promise<{}>;
}

export class NotFoundError extends Error {
  constructor() {
    super('Order type not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class PromoCodeEmptyError extends Error {
  constructor() {
    super('Promo code invalid');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements OrderAPI {
  private client: APIClient;
  private headersManager: HeadersManager;

  constructor(client: APIClient, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: OrderAPI['getAll'] = async () => {
    try {
      const response = await this.client.get<{ data: Order[]; meta: PaginationMeta }>(`/api/orders`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public create: OrderAPI['create'] = async (data) => {
    try {
      const response = await this.client.post<{ data: Order }>(`/api/orders`, data, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response.data.promo_code) {
        throw new PromoCodeEmptyError();
      }
      throw e;
    }
  };

  public edit: OrderAPI['edit'] = async (orderID, data) => {
    try {
      const response = await this.client.put<{ data: Order }>(`/api/orders/${orderID}`, data, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new NotFoundError();
      }
      if (e.response.data.promo_code) {
        throw new PromoCodeEmptyError();
      }
      throw e;
    }
  };

  public getForUser: OrderAPI['getForUser'] = async (userID, page) => {
    try {
      const response = await this.client.get<{ data: Order[]; meta: PaginationMeta }>(
        `/api/users/${userID}/orders${buildSearchString({ page, limit: 10 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public getOne: OrderAPI['getOne'] = async (orderID) => {
    try {
      const response = await this.client.get<{ data: Order }>(`/api/orders/${orderID}`, {
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

  public status: OrderAPI['status'] = async (orderID) => {
    try {
      await this.client.head(`/api/orders/${orderID}`, {
        headers: this.headersManager.getHeaders(),
      });
      return {};
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new NotFoundError();
      }
      throw e;
    }
  };

  public delete: OrderAPI['delete'] = async (orderID) => {
    try {
      await this.client.delete(`/api/orders/${orderID}`, {
        headers: this.headersManager.getHeaders(),
      });
      return {};
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new NotFoundError();
      }
      throw e;
    }
  };
}
