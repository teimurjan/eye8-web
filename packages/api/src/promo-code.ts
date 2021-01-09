import { Client } from '@eye8/api/types';
import { HeadersManager } from '@eye8/manager/headers';
import { flagToSearchStringValue, buildSearchString } from '@eye8/shared/utils';

export interface PromoCodeListResponseItem {
  id: number;
  discount: number;
  amount?: number;
  value: string;
  is_active: boolean;
  disable_on_use: boolean;
  products?: number[];
  created_on: string;
  updated_on: string;
  is_deleted: boolean | null;
}

export interface PromoCodeListResponseData {
  data: PromoCodeListResponseItem[];
}

export interface PromoCodeDetailResponseData {
  data: PromoCodeListResponseItem;
}

export interface PromoCodeCreatePayload {
  discount: number;
  amount?: number;
  value: string;
  is_active: boolean;
  disable_on_use: boolean;
  products: number[];
}

export interface PromoCodeEditPayload {
  is_active: boolean;
  disable_on_use: boolean;
  products: number[];
}

export interface GetOneOptions {
  deleted?: boolean;
}

export interface PromoCodeAPI {
  getAll(deleted?: boolean): Promise<PromoCodeListResponseData>;
  getOne(id: number, options: GetOneOptions): Promise<PromoCodeDetailResponseData>;
  getByValue(value: string): Promise<PromoCodeDetailResponseData>;
  delete(id: number, forever?: boolean): Promise<{}>;
  create(payload: PromoCodeCreatePayload): Promise<PromoCodeDetailResponseData>;
  edit(id: number, payload: PromoCodeEditPayload): Promise<PromoCodeDetailResponseData>;
  status(id: number, deleted?: boolean): Promise<{}>;
}

export class PromoCodeNotFoundError extends Error {
  constructor() {
    super('Promo code not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class PromoCodeValueDuplicatedError extends Error {
  constructor() {
    super('Promo code not found');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
export class PromoCodeWithOrdersNotDeletedError extends Error {
  constructor() {
    super('Promo code with orders is untouchable');
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default class implements PromoCodeAPI {
  private client: Client;
  private headersManager: HeadersManager;

  constructor(client: Client, headersManager: HeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: PromoCodeAPI['getAll'] = async (deleted = false) => {
    try {
      const response = await this.client.get<PromoCodeListResponseData>(
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
        throw new PromoCodeNotFoundError();
      }
      if (e.response && e.response.data.orders) {
        throw new PromoCodeWithOrdersNotDeletedError();
      }
      throw e;
    }
  };

  public create: PromoCodeAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<PromoCodeDetailResponseData>(`/api/promo_codes`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response.data.value) {
        throw new PromoCodeValueDuplicatedError();
      }
      throw e;
    }
  };

  public edit: PromoCodeAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<PromoCodeDetailResponseData>(`/api/promo_codes/${id}`, payload, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new PromoCodeNotFoundError();
      }
      if (e.response && e.response.data.value) {
        throw new PromoCodeValueDuplicatedError();
      }
      if (e.response && e.response.data.orders) {
        throw new PromoCodeWithOrdersNotDeletedError();
      }
      throw e;
    }
  };

  public getOne: PromoCodeAPI['getOne'] = async (id, options) => {
    try {
      const response = await this.client.get<PromoCodeDetailResponseData>(
        `/api/promo_codes/${id}${buildSearchString({ deleted: flagToSearchStringValue(options.deleted) })}`,
        {
          headers: this.headersManager.getHeaders(),
        },
      );
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new PromoCodeNotFoundError();
      }
      throw e;
    }
  };

  public getByValue: PromoCodeAPI['getByValue'] = async (value) => {
    try {
      const response = await this.client.get<PromoCodeDetailResponseData>(`/api/promo_codes/${value}`, {
        headers: this.headersManager.getHeaders(),
      });
      return response.data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        throw new PromoCodeNotFoundError();
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
        throw new PromoCodeNotFoundError();
      }
      throw e;
    }
  };
}
