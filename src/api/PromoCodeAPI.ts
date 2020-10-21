import { Client } from 'ttypes/http';

import { IHeadersManager } from 'src/manager/HeadersManager';
import { flagToSearchStringValue, buildSearchString } from 'src/utils/searchString';

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
        throw new errors.PromoCodeNotFound();
      }
      if (e.response && e.response.data.orders) {
        throw new errors.PromoCodeWithOrdersIsUntouchable();
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
        throw new errors.DuplicatedValueError();
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
        throw new errors.PromoCodeNotFound();
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
        throw new errors.PromoCodeNotFound();
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
        throw new errors.PromoCodeNotFound();
      }
      throw e;
    }
  };
}
