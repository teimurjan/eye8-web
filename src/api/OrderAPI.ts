import { Client } from 'ttypes/http';

import { IHeadersManager } from 'src/manager/HeadersManager';
import { buildQueryString } from 'src/utils/queryString';

export interface IOrderItem {
  id: number;
  quantity: number;
  product_price_per_item: number;
  product_discount: number;
  product_upc?: string;
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
export interface IOrderListResponseItem {
  id: number;
  user_name: string;
  user_phone_number: string;
  user_address: string;
  created_on: string;
  updated_on: string;
  is_deleted: boolean | null;
  items: IOrderItem[];
  status: 'idle' | 'completed' | 'approved' | 'rejected';
  promo_code?: {
    id: number;
    value: string;
    discount: number;
    amount?: number;
  };
}

export interface IOrderListResponseMeta {
  count: number;
  pages_count: number;
  limit: number;
  page: number;
}

export interface IOrderListResponseData {
  data: IOrderListResponseItem[];
  meta: IOrderListResponseMeta;
}

// DETAIL
export type IOrderDetailResponseItem = IOrderListResponseItem & {
  promo_code?: {
    id: number;
    value: string;
    discount: number;
    amount?: number;
    products?: Array<{ id: number; price: number; quantity: number; discount?: number }>;
  };
};

export interface IOrderResponseData {
  data: IOrderDetailResponseItem;
}

// FOR USER
export type IOrderForUserResponseItem = IOrderListResponseItem & {
  promo_code?: {
    id: number;
    value: string;
    discount: number;
    amount?: number;
    products?: number[];
  };
};

export interface IOrderForUserResponseData {
  data: IOrderForUserResponseItem[];
  meta: IOrderListResponseMeta;
}

// PAYLOADS
export interface IOrderCreatePayload {
  user_name: string;
  user_phone_number: string;
  user_address: string;
  items: Array<{
    product_id: number;
    quantity: number;
  }>;
  promo_code?: string;
}

export interface IOrderEditPayload {
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
  promo_code?: {
    id: number;
    value: string;
    discount: number;
    amount: number;
  };
}

export interface IOrderAPI {
  getAll(): Promise<IOrderListResponseData>;
  getForUser(userID: number, page: number): Promise<IOrderForUserResponseData>;
  create(payload: IOrderCreatePayload): Promise<IOrderResponseData>;
  edit(orderID: number, payload: IOrderEditPayload): Promise<IOrderResponseData>;
  getOne(orderID: number): Promise<IOrderResponseData>;
  status(id: number): Promise<{}>;
  delete(id: number): Promise<{}>;
}

export const errors = {
  OrderNotFound: class extends Error {
    constructor() {
      super('Order type not found');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  PromoCodeInvalid: class extends Error {
    constructor() {
      super('Promo code invalid');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class OrderAPI implements IOrderAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public async getAll() {
    try {
      const response = await this.client.get<IOrderListResponseData>(`/api/orders`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async create(data: IOrderCreatePayload) {
    try {
      const response = await this.client.post<IOrderResponseData>(`/api/orders`, data, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response.data.promo_code) {
        throw new errors.PromoCodeInvalid();
      }
      throw e;
    }
  }

  public async edit(orderID: number, data: IOrderEditPayload) {
    try {
      const response = await this.client.put<IOrderResponseData>(`/api/orders/${orderID}`, data, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.OrderNotFound();
      }
      if (e.response.data.promo_code) {
        throw new errors.PromoCodeInvalid();
      }
      throw e;
    }
  }

  public async getForUser(userID: number, page: number) {
    try {
      const response = await this.client.get<IOrderForUserResponseData>(
        `/api/users/${userID}/orders${buildQueryString({ page, limit: 10 })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async getOne(orderID: number) {
    try {
      const response = await this.client.get<IOrderResponseData>(`/api/orders/${orderID}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.OrderNotFound();
      }
      throw e;
    }
  }

  public async status(orderID: number) {
    try {
      await this.client.head(`/api/orders/${orderID}`, {
        headers: this.headersManager.getHeaders(),
      });
      return {};
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.OrderNotFound();
      }
      throw e;
    }
  }

  public async delete(orderID: number) {
    try {
      await this.client.delete(`/api/orders/${orderID}`, {
        headers: this.headersManager.getHeaders(),
      });
      return {};
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.OrderNotFound();
      }
      throw e;
    }
  }
}
