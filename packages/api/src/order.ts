import { APIClient } from '@eye8/api/client';
import { HeadersManager } from '@eye8/manager/headers';
import { buildSearchString } from '@eye8/shared/utils';

export interface OrderItem {
  id: number;
  quantity: number;
  product_price_per_item: number;
  product_discount: number;
  product?: {
    id: number;
    quantity: number;
    product_type: {
      id: number;
      name: string;
      slug: string;
    };
  };
}

// LIST
export interface OrderListResponseItem {
  id: number;
  user_name: string;
  user_phone_number: string;
  user_address: string;
  created_on: string;
  updated_on: string;
  is_deleted: boolean | null;
  items: OrderItem[];
  status: 'idle' | 'completed' | 'approved' | 'rejected';
  promo_code_value?: string;
  promo_code_products?: number[];
  promo_code_discount?: number;
  promo_code_amount?: number;
}

export interface OrderListResponseMeta {
  count: number;
  pages_count: number;
  limit: number;
  page: number;
}

export interface OrderListResponseData {
  data: OrderListResponseItem[];
  meta: OrderListResponseMeta;
}

// DETAIL
export interface OrderResponseData {
  data: OrderListResponseItem;
}

// PAYLOADS
export interface OrderCreatePayload {
  user_name: string;
  user_phone_number: string;
  user_address: string;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  promo_code?: string;
}

export interface OrderEditPayload {
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

export interface OrderAPI {
  getAll(): Promise<OrderListResponseData>;
  getForUser(userID: number, page: number): Promise<OrderListResponseData>;
  create(payload: OrderCreatePayload): Promise<OrderResponseData>;
  edit(orderID: number, payload: OrderEditPayload): Promise<OrderResponseData>;
  getOne(orderID: number): Promise<OrderResponseData>;
  status(id: number): Promise<{}>;
  delete(id: number): Promise<{}>;
}

export class OrderNotFoundError extends Error {
  constructor() {
    super('Order type not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class PromoCodeIsNotSetError extends Error {
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
      const response = await this.client.get<OrderListResponseData>(`/api/orders`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  };

  public create: OrderAPI['create'] = async (data) => {
    try {
      const response = await this.client.post<OrderResponseData>(`/api/orders`, data, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response.data.promo_code) {
        throw new PromoCodeIsNotSetError();
      }
      throw e;
    }
  };

  public edit: OrderAPI['edit'] = async (orderID, data) => {
    try {
      const response = await this.client.put<OrderResponseData>(`/api/orders/${orderID}`, data, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new OrderNotFoundError();
      }
      if (e.response.data.promo_code) {
        throw new PromoCodeIsNotSetError();
      }
      throw e;
    }
  };

  public getForUser: OrderAPI['getForUser'] = async (userID, page) => {
    try {
      const response = await this.client.get<OrderListResponseData>(
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
      const response = await this.client.get<OrderResponseData>(`/api/orders/${orderID}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new OrderNotFoundError();
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
        throw new OrderNotFoundError();
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
        throw new OrderNotFoundError();
      }
      throw e;
    }
  };
}
