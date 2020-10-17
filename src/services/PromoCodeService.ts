import { normalize, schema } from 'normalizr';

import * as promoCodeAPI from 'src/api/PromoCodeAPI';

export const errors = {
  PromoCodeNotExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  ValueAlreadyExists: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
  PromoCodeHasOrders: class extends Error {
    constructor() {
      super();
      Object.setPrototypeOf(this, new.target.prototype);
    }
  },
};

export interface IPromoCodeService {
  getAll(
    deleted?: boolean,
  ): Promise<{
    entities: {
      promoCodes: {
        [key: string]: promoCodeAPI.IPromoCodeListResponseItem;
      };
    };
    result: number[];
  }>;
  create(payload: promoCodeAPI.IPromoCodeCreatePayload): Promise<promoCodeAPI.IPromoCodeListResponseItem>;
  edit(id: number, payload: promoCodeAPI.IPromoCodeEditPayload): Promise<promoCodeAPI.IPromoCodeListResponseItem>;
  delete(id: number, forever?: boolean): Promise<{}>;
  exists(id: number, deleted?: boolean): Promise<boolean>;
  getOne(
    id: number,
    options?: promoCodeAPI.IGetOneOptions,
  ): Promise<promoCodeAPI.IPromoCodeListResponseItem | undefined>;
  getByValue(value: string): Promise<promoCodeAPI.IPromoCodeListResponseItem | undefined>;
}

export class PromoCodeService implements IPromoCodeService {
  private API: promoCodeAPI.IPromoCodeAPI;
  constructor(API: promoCodeAPI.IPromoCodeAPI) {
    this.API = API;
  }

  public getAll: IPromoCodeService['getAll'] = async (deleted) => {
    const products = await this.API.getAll(deleted);
    return normalize(products.data, [new schema.Entity('promoCodes')]);
  };

  public create: IPromoCodeService['create'] = async (payload) => {
    try {
      return (await this.API.create(payload)).data;
    } catch (e) {
      if (e instanceof promoCodeAPI.errors.DuplicatedValueError) {
        throw new errors.ValueAlreadyExists();
      }
      throw e;
    }
  };

  public edit: IPromoCodeService['edit'] = async (id, payload) => {
    try {
      return (await this.API.edit(id, payload)).data;
    } catch (e) {
      if (e instanceof promoCodeAPI.errors.PromoCodeNotFound) {
        throw new errors.PromoCodeNotExists();
      }
      if (e instanceof promoCodeAPI.errors.DuplicatedValueError) {
        throw new errors.ValueAlreadyExists();
      }
      if (e instanceof promoCodeAPI.errors.PromoCodeWithOrdersIsUntouchable) {
        throw new errors.PromoCodeHasOrders();
      }
      throw e;
    }
  };

  public delete: IPromoCodeService['delete'] = async (id, forever) => {
    try {
      return await this.API.delete(id, forever);
    } catch (e) {
      if (e instanceof promoCodeAPI.errors.PromoCodeNotFound) {
        throw new errors.PromoCodeNotExists();
      }
      if (e instanceof promoCodeAPI.errors.PromoCodeWithOrdersIsUntouchable) {
        throw new errors.PromoCodeHasOrders();
      }
      throw e;
    }
  };

  public exists: IPromoCodeService['exists'] = async (id, deleted) => {
    try {
      await this.API.status(id, deleted);
      return true;
    } catch (e) {
      if (e instanceof promoCodeAPI.errors.PromoCodeNotFound) {
        return false;
      }
      throw e;
    }
  };

  public getOne: IPromoCodeService['getOne'] = async (id, options = {}) => {
    try {
      return (await this.API.getOne(id, options)).data;
    } catch (e) {
      if (e instanceof promoCodeAPI.errors.PromoCodeNotFound) {
        return undefined;
      }
      throw e;
    }
  };

  public getByValue: IPromoCodeService['getByValue'] = async (value) => {
    try {
      return (await this.API.getByValue(value)).data;
    } catch (e) {
      if (e instanceof promoCodeAPI.errors.PromoCodeNotFound) {
        return undefined;
      }
      throw e;
    }
  };
}
