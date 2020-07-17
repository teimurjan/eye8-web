import { Client } from 'ttypes/http';

import { IHeadersManager } from 'src/manager/HeadersManager';

export interface IPromoCodeListResponseItem {
  id: number;
  discount: number;
  amount?: number;
  value: string;
  is_active: boolean;
  disable_on_use: boolean;
  products: number[];
  created_on: string;
  updated_on: string;
  is_deleted: boolean | null;
}

export interface IPromoCodeListResponseData {
  data: IPromoCodeListResponseItem[];
}

export interface IPromoCodeDetailResponseItem {
  id: number;
  discount: number;
  amount?: number;
  value: string;
  is_active: boolean;
  disable_on_use: boolean;
  products: Array<{
    product_type: {
      id: number;
      name: string;
    };
    discount: number;
    id: number;
    price: number;
    quantity: number;
  }>;
  created_on: string;
  updated_on: string;
  is_deleted: boolean | null;
}

export interface IPromoCodeDetailResponseData {
  data: IPromoCodeDetailResponseItem;
}

export interface IPromoCodeCreatePayload {
  discount: number;
  amount?: number;
  value: string;
  is_active: boolean;
  disable_on_use: boolean;
  products: number[];
}

export interface IPromoCodeEditPayload {
  is_active: boolean;
  disable_on_use: boolean;
  products: number[];
}

export interface IPromoCodeAPI {
  getAll(): Promise<IPromoCodeListResponseData>;
  getOne(id: number): Promise<IPromoCodeDetailResponseData>;
  getByValue(value: string): Promise<IPromoCodeDetailResponseData>;
  delete(id: number): Promise<{}>;
  create(payload: IPromoCodeCreatePayload): Promise<IPromoCodeDetailResponseData>;
  edit(id: number, payload: IPromoCodeEditPayload): Promise<IPromoCodeDetailResponseData>;
  status(id: number): Promise<{}>;
}

export const errors = {
  PromoCodeNotFound: class extends Error {
    constructor() {
      super('Promo code not found');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  DuplicatedValueError: class extends Error {
    constructor() {
      super('Promo code not found');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  PromoCodeWithOrdersIsUntouchable: class extends Error {
    constructor() {
      super('Promo code with orders is untouchable');
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export class PromoCodeAPI implements IPromoCodeAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public async getAll() {
    try {
      const response = await this.client.get<IPromoCodeListResponseData>('/api/promo_codes', {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      throw e;
    }
  }

  public async delete(id: number) {
    try {
      const response = await this.client.delete<{}>(`/api/promo_codes/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.PromoCodeNotFound();
      }
      if (e.response && e.response.data.orders) {
        throw new errors.PromoCodeWithOrdersIsUntouchable();
      }
      throw e;
    }
  }

  public async create(payload: IPromoCodeCreatePayload) {
    try {
      const response = await this.client.post<IPromoCodeDetailResponseData>(`/api/promo_codes`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response.data.value) {
        throw new errors.DuplicatedValueError();
      }
      throw e;
    }
  }

  public async edit(id: number, payload: IPromoCodeEditPayload) {
    try {
      const response = await this.client.put<IPromoCodeDetailResponseData>(`/api/promo_codes/${id}`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.PromoCodeNotFound();
      }
      if (e.response && e.response.data.value) {
        throw new errors.DuplicatedValueError();
      }
      if (e.response && e.response.data.orders) {
        throw new errors.PromoCodeWithOrdersIsUntouchable();
      }
      throw e;
    }
  }

  public async getOne(id: number) {
    try {
      const response = await this.client.get<IPromoCodeDetailResponseData>(`/api/promo_codes/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.PromoCodeNotFound();
      }
      throw e;
    }
  }

  public async getByValue(value: string) {
    try {
      const response = await this.client.get<IPromoCodeDetailResponseData>(`/api/promo_codes/${value}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.PromoCodeNotFound();
      }
      throw e;
    }
  }

  public async status(id: number) {
    try {
      const response = await this.client.head<{}>(`/api/promo_codes/${id}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new errors.PromoCodeNotFound();
      }
      throw e;
    }
  }
}
