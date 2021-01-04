import { Client } from '@eye8/api/types';
import { IHeadersManager } from '@eye8/manager/headers';
import { flagToSearchStringValue, buildSearchString } from '@eye8/shared/utils';

export interface IPromoCodeListResponseItem {
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

export interface IPromoCodeListResponseData {
  data: IPromoCodeListResponseItem[];
}

export interface IPromoCodeDetailResponseData {
  data: IPromoCodeListResponseItem;
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

export interface IGetOneOptions {
  deleted?: boolean;
}

export interface IPromoCodeAPI {
  getAll(deleted?: boolean): Promise<IPromoCodeListResponseData>;
  getOne(id: number, options: IGetOneOptions): Promise<IPromoCodeDetailResponseData>;
  getByValue(value: string): Promise<IPromoCodeDetailResponseData>;
  delete(id: number, forever?: boolean): Promise<{}>;
  create(payload: IPromoCodeCreatePayload): Promise<IPromoCodeDetailResponseData>;
  edit(id: number, payload: IPromoCodeEditPayload): Promise<IPromoCodeDetailResponseData>;
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

export class PromoCodeAPI implements IPromoCodeAPI {
  private client: Client;
  private headersManager: IHeadersManager;

  constructor(client: Client, headersManager: IHeadersManager) {
    this.client = client;
    this.headersManager = headersManager;
  }

  public getAll: IPromoCodeAPI['getAll'] = async (deleted = false) => {
    try {
      const response = await this.client.get<IPromoCodeListResponseData>(
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

  public delete: IPromoCodeAPI['delete'] = async (id, forever = false) => {
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

  public create: IPromoCodeAPI['create'] = async (payload) => {
    try {
      const response = await this.client.post<IPromoCodeDetailResponseData>(`/api/promo_codes`, payload, {
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

  public edit: IPromoCodeAPI['edit'] = async (id, payload) => {
    try {
      const response = await this.client.put<IPromoCodeDetailResponseData>(`/api/promo_codes/${id}`, payload, {
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

  public getOne: IPromoCodeAPI['getOne'] = async (id, options) => {
    try {
      const response = await this.client.get<IPromoCodeDetailResponseData>(
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

  public getByValue: IPromoCodeAPI['getByValue'] = async (value) => {
    try {
      const response = await this.client.get<IPromoCodeDetailResponseData>(`/api/promo_codes/${value}`, {
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

  public status: IPromoCodeAPI['status'] = async (id, deleted = false) => {
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
