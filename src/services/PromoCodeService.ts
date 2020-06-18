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
  getAll(): Promise<{
    entities: {
      promoCodes: {
        [key: string]: promoCodeAPI.IPromoCodeListResponseItem;
      };
    };
    result: number[];
  }>;
  create(payload: promoCodeAPI.IPromoCodeCreatePayload): Promise<promoCodeAPI.IPromoCodeDetailResponseItem>;
  edit(id: number, payload: promoCodeAPI.IPromoCodeEditPayload): Promise<promoCodeAPI.IPromoCodeDetailResponseItem>;
  delete(id: number): Promise<{}>;
  exists(id: number): Promise<boolean>;
  getOne(id: number): Promise<promoCodeAPI.IPromoCodeDetailResponseItem | undefined>;
  getByValue(value: string): Promise<promoCodeAPI.IPromoCodeDetailResponseItem | undefined>;
}

export class PromoCodeService implements IPromoCodeService {
  private API: promoCodeAPI.IPromoCodeAPI;
  constructor(API: promoCodeAPI.IPromoCodeAPI) {
    this.API = API;
  }

  public getAll: IPromoCodeService['getAll'] = async () => {
    const products = await this.API.getAll();
    return normalize(products.data, [new schema.Entity('promoCodes')]);
  };

  public create: IPromoCodeService['create'] = async (payload: promoCodeAPI.IPromoCodeCreatePayload) => {
    try {
      return (await this.API.create(payload)).data;
    } catch (e) {
      if (e instanceof promoCodeAPI.errors.DuplicatedValueError) {
        throw new errors.ValueAlreadyExists();
      }
      throw e;
    }
  };

  public edit: IPromoCodeService['edit'] = async (id, payload: promoCodeAPI.IPromoCodeEditPayload) => {
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

  public delete: IPromoCodeService['delete'] = async id => {
    try {
      return await this.API.delete(id);
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

  public exists: IPromoCodeService['exists'] = async id => {
    try {
      await this.API.status(id);
      return true;
    } catch (e) {
      if (e instanceof promoCodeAPI.errors.PromoCodeNotFound) {
        return false;
      }
      throw e;
    }
  };

  public getOne: IPromoCodeService['getOne'] = async id => {
    try {
      return (await this.API.getOne(id)).data;
    } catch (e) {
      if (e instanceof promoCodeAPI.errors.PromoCodeNotFound) {
        return undefined;
      }
      throw e;
    }
  };

  public getByValue: IPromoCodeService['getByValue'] = async value => {
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
